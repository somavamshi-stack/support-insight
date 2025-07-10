import nextJest from "next/jest";

const createJestConfig = nextJest({
    dir: "./"
});

const customJestConfig = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testMatch: ["**/?(*.)+(test|spec).(ts|tsx)"],
    moduleNameMapper: {
        "^@atoms$": "<rootDir>/src/components/atoms/index.ts",
        "^@constants$": "<rootDir>/src/constants/index.ts",
        "^@molecules$": "<rootDir>/src/components/molecules/index.ts",
        "^@organisms$": "<rootDir>/src/components/organisms/index.ts",
        "^@templates$": "<rootDir>/src/components/templates/index.ts",
        "^@types$": "<rootDir>/src/types/index.ts",
        "^@utils$": "<rootDir>/src/utils/index.ts",
        "^@context/(.*)$": "<rootDir>/src/context/$1",
        "^@redux/(.*)$": "<rootDir>/src/redux/$1",
        "^@hooks$": "<rootDir>/src/hooks/index.ts",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy" // Mock CSS imports
    },
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": "babel-jest" // Use Babel for transformations
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
    watchPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
    reporters: ["default", ["jest-junit", { outputDirectory: "./test-reports", outputName: "junit.xml" }]]
};

export default createJestConfig(customJestConfig);
