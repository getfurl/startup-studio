import { FurlTimestamp } from './timestamp.model';

export class FurlUser {
  uid: string;
  userName: string;
  timestamp: Date;

  constructor(uid, userName, timestamp) {
    this.uid = uid;
    this.userName = userName;
    this.timestamp = FurlTimestamp.parse(timestamp);
  }

  static constructFromData(
    data: any
  ): FurlUser {
    const {uid, userName, timestamp} = data;
    return new FurlUser(uid, userName, timestamp);
  }
}