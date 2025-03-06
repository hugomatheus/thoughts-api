import { v4 as uuidv4 } from 'uuid';

type UserContructorProps = {
  id?: string;
  name: string;
  createdAt?: Date;
};

type UserCreateCommand = {
  name: string;
};

export class User {
  id: string;
  name: string;
  createdAt: Date;

  constructor(props: UserContructorProps) {
    this.id = props.id ?? uuidv4();
    this.name = props.name;
    this.createdAt = props.createdAt ?? new Date();
  }

  static createUser(props: UserCreateCommand) {
    return new User(props);
  }
}
