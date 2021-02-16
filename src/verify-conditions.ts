import { Config, Context } from "semantic-release";
import { hasTaskToPublish } from "./gradle";

export const verifyConditions = async (
  _: object,
  context: Config & Context
) => {
  const { cwd, env, logger } = context;
  if (cwd === undefined) {
    throw new Error("cwd not provided");
  }
  let hasTask = false;
  try {
    hasTask = await hasTaskToPublish(cwd, env);
  } catch (_) {
    // do nothing here, we already have a sensible default
  }
  if (!hasTask) {
    throw new Error('Missing mandatory task: "publishPlugins"');
  }
  const gradlePublishKey = (process.env.GRADLE_PUBLISH_KEY ?? "").trim();
  if (gradlePublishKey.length === 0) {
    throw new Error(
      'Environment variable "GRADLE_PUBLISH_KEY" is missing or blank'
    );
  }
  const gradlePublishSecret = (process.env.GRADLE_PUBLISH_SECRET ?? "").trim();
  if (gradlePublishSecret.length === 0) {
    throw new Error(
      'Environment variable "GRADLE_PUBLISH_SECRET" is missing or blank'
    );
  }
  logger.log("Verified conditions");
};
