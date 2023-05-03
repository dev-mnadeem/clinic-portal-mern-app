import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import axios from 'axios';
import Login from '../pages/Login';
import Patientdash from '../pages/patientdash';
import AssignmentDesk from '../components/AssignmentDesk';

jest.mock('axios', () => ({
  get:jest.fn(),
  post:jest.fn(),
  interceptors:{request:{use:jest.fn()}, response:{use:jest.fn()}},
}));

const future = {v7_startTransition:true, v7_relativeSplatPath:true};
const reply = data => Promise.resolve({data});
function routeBy(table) {
  return url => {
    const key = Object.keys(table).find(path => url.endsWith(path));
    if (!key) return Promise.reject(new Error(`unexpected request ${url}`));
    const value = table[key];
    return value instanceof Error ? Promise.reject(value) : reply(typeof value === 'function' ? value() : value);
  };
}

beforeEach(() => {
  jest.resetAllMocks();
  sessionStorage.setItem('clinic-session', JSON.stringify({token:'test', role:'patient', user:{name:'Avery Fictional'}}));
});

test('login shows the server error and stays on the form', async () => {
  axios.post.mockRejectedValue({response:{status:401, data:{error:'Invalid email or password'}}});
  render(<MemoryRouter future={future}><Login heading="Patients"/></MemoryRouter>);
  await userEvent.type(screen.getByLabelText('Email address'), 'avery@clinic.example.test');
  await userEvent.type(screen.getByLabelText('Password'), 'wrong-password');
  await userEvent.click(screen.getByRole('button', {name:'Sign in'}));
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
  expect(screen.getByRole('button', {name:'Sign in'})).toBeEnabled();
});

test('a successful login opens the role workspace', async () => {
  axios.post.mockResolvedValue({data:{token:'t', role:'doctor', _id:'1'}});
  render(<MemoryRouter future={future} initialEntries={['/doctorlogin']}><Routes>
    <Route path="/doctorlogin" element={<Login heading="Doctors"/>}/>
    <Route path="/doc" element={<p>doctor workspace</p>}/>
  </Routes></MemoryRouter>);
  await userEvent.type(screen.getByLabelText('Email address'), 'rowan@clinic.example.test');
  await userEvent.type(screen.getByLabelText('Password'), 'LocalTestPassword123!');
  await userEvent.click(screen.getByRole('button', {name:'Sign in'}));
  expect(await screen.findByText('doctor workspace')).toBeInTheDocument();
  expect(axios.post.mock.calls[0][1]).toEqual({data:{email:'rowan@clinic.example.test', password:'LocalTestPassword123!'}});
});

test('the patient record shows empty states and marks waiting appointments', async () => {
  axios.post.mockImplementation(routeBy({
    'Patients/getAllAppointments':[{_id:'a1', doctorName:'Dr. Rowan Sample', dateTime:'2099-04-02', reason:'Check-up', Accepted:false}],
    'Patients/myPrescription':{Prescription:[]},
    'Patients/getMyReport':[],
  }));
  axios.get.mockImplementation(routeBy({'Patients/doctors':[]}));
  render(<MemoryRouter future={future}><Patientdash/></MemoryRouter>);
  expect(await screen.findByText('Dr. Rowan Sample')).toBeInTheDocument();
  expect(screen.getByText('Waiting')).toBeInTheDocument();
  expect(await screen.findByText('No prescriptions on record.')).toBeInTheDocument();
  expect(screen.getByText('No lab tests have been requested for you.')).toBeInTheDocument();
});

test('a failed list load offers a retry', async () => {
  let calls = 0;
  axios.post.mockImplementation(url => {
    if (url.endsWith('Patients/getAllAppointments')) {
      calls += 1;
      return calls === 1 ? Promise.reject(new Error('offline')) : reply([]);
    }
    return url.endsWith('myPrescription') ? reply({Prescription:[]}) : reply([]);
  });
  axios.get.mockResolvedValue({data:[]});
  render(<MemoryRouter future={future}><Patientdash/></MemoryRouter>);
  const alert = await screen.findByRole('alert');
  await userEvent.click(within(alert).getByRole('button', {name:'Try again'}));
  expect(await screen.findByText(/No appointments yet/)).toBeInTheDocument();
});

test('booking sends the chosen doctor, date and reason', async () => {
  axios.post.mockImplementation(routeBy({
    'Patients/getAllAppointments':[],
    'Patients/myPrescription':{Prescription:[]},
    'Patients/getMyReport':[],
    'Patients/addAppointment':{_id:'new'},
  }));
  axios.get.mockImplementation(routeBy({'Patients/doctors':[{_id:'d1', name:'Dr. Rowan Sample', specification:'General practice'}]}));
  render(<MemoryRouter future={future}><Patientdash/></MemoryRouter>);
  await userEvent.click(screen.getByRole('button', {name:'Book a visit'}));
  await userEvent.selectOptions(await screen.findByLabelText('Doctor'), 'd1');
  fireEvent.change(screen.getByLabelText('Preferred date'), {target:{value:'2099-04-02'}});
  await userEvent.type(screen.getByLabelText('Reason for the visit'), 'Persistent cough');
  await userEvent.click(screen.getByRole('button', {name:'Send request'}));
  expect(await screen.findByRole('status')).toHaveTextContent('Request sent');
  const call = axios.post.mock.calls.find(([url]) => url.endsWith('addAppointment'));
  expect(call[1]).toEqual({data:{doctorId:'d1', datetime:'2099-04-02', reason:'Persistent cough'}});
});

test('the routing desk explains when there is nowhere to route a request', async () => {
  axios.get.mockResolvedValue({data:{reports:[{_id:'r1', patientName:'Avery Fictional', Type:'Thyroid panel'}], prescriptions:[], labs:[], pharmacies:[{_id:'p1', name:'Corner Demo Pharmacy'}]}});
  render(<AssignmentDesk/>);
  expect(await screen.findByText('Add a laboratory account before routing these.')).toBeInTheDocument();
  expect(screen.getByText('Nothing to route.')).toBeInTheDocument();
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
});
