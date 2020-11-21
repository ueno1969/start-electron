module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    moduleNameMapper: {
        "^lib/(.*)$": "<rootDir>/src/lib/$1",
    },
};
