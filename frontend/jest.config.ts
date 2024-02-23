export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    //".+\\.(css|scss|png|jpg|svg)$": "jest-transform-stub",
    // process `*.tsx` files with `ts-jest`
  },
  moduleNameMapper: {
    //"\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__ mocks __/fileMock.js",
    "\\.(png|jpg|ico|jpeg|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/test/__mocks__/fileMock.js",
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less)$": "<rootDir>/frontend/node_modules/tailwindcss",
  },
};
