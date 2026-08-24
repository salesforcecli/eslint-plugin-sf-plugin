module.exports = {
    testEnvironment: 'node',
    transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: { types: ['jest', 'node'] } }] }
};
