import { FurlTimestamp } from './timestamp.model';

export class FurlUser {
  uid: string;
  email: string;
  userName: string;
  timestamp: Date;

  constructor(uid, email, userName, timestamp) {
    this.uid = uid;
    this.email = email;
    this.userName = userName;
    this.timestamp = FurlTimestamp.parse(timestamp);
  }

  static constructFromData(
    data: any
  ): FurlUser {
    const {uid, email, userName, timestamp} = data;
    return new FurlUser(uid, email, userName, timestamp);
  }

  static constructUserNameHolder(uid: string) {
    return {
      uid
    }
  }
}