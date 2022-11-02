import { AthenaExpress } from "athena-express";

const AWS = require("aws-sdk");

const athenaExpressConfig = {
  aws: AWS, // required
  workgroup: "workgroup-name", // optional
  formatJson: true, // optional
  retry: 200, // optional
  getStats: true, // optional
  ignoreEmpty: false, // optional
  skipResults: false, // optional
  waitForResults: true, // optional
  catalog: "hive" //optional
};

//Initializing AthenaExpress
export const athenaClient = new AthenaExpress(athenaExpressConfig);
