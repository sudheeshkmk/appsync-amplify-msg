/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onMessagePublishedByAppId = /* GraphQL */ `
  subscription OnMessagePublishedByAppId($appId: ID!) {
    onMessagePublishedByAppId(appId: $appId) {
      appId
      roomId
      subscriberId
      sender
      content
      __typename
    }
  }
`;
