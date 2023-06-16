export type Title = {
  DataType: string;
  StringValue: string;
};

export type Author = {
  DataType: string;
  StringValue: string;
};

export type WeeksOn = {
  DataType: string;
  StringValue: string;
};

export type MessageAttributes = {
  Title?: Title;
  Author?: Author;
  WeeksOn?: WeeksOn;
};

export type ParamsSQS = {
  DelaySeconds?: number;
  MessageAttributes?: MessageAttributes;
  MessageBody: string;
  QueueUrl?: string;
};
