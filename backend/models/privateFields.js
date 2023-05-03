export function protectCredentials(schema) {
  schema.add({tokenVersion:{type:Number, default:0}});
  schema.pre('save', function () {
    if (!this.isNew && this.isModified('password')) this.tokenVersion = (this.tokenVersion || 0) + 1;
  });
  schema.set('toJSON', {transform: (_document, record) => {
    delete record.password;
    delete record.__v;
    delete record.tokenVersion;
    return record;
  }});
}
