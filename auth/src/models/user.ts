import mongoose from 'mongoose';
import { Password } from '../services/password';

/**
 * @interface
 * * properties that are required to create a new User
 */
export interface UserAttrs {
  email: string;
  password: string;
}

/**
 * @interface
 * * propeties that a User model has
 */
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}
/**
 * @interface
 * * properties that a User Document has
 */
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
/**
 * @function
 * * add build function to User
 * @param attrs UserAttrs
 * @returns User
 */
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

/**
 * * User Collection
 */
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

const user = User.build({
  email: 'test@test.com',
  password: 'testpassword',
});

export { User };
