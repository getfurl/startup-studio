export class FurlTimestamp {
  static parse(timestamp: Date | any) {
    if (timestamp.toDate) {
      return timestamp.toDate();
    }

    if (timestamp.getTime) {
      return new Date(timestamp.getTime());
    }

    if (!isNaN(timestamp)) {
      return new Date(timestamp);
    }
  }
}