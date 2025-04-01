import { SnowflakeId } from "@akashrajpurohit/snowflake-id";

export const generateId = () => {
  const snowflake = SnowflakeId({
    workerId: 1,
    epoch: 1728488947000,
  });
  return snowflake.generate();
};