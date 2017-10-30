"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
describe('greeter function', () => {
    // Read more about fake timers: http://facebook.github.io/jest/docs/en/timer-mocks.html#content
    jest.useFakeTimers();
    const name = 'John';
    let hello;
    // Act before assertions
    beforeAll(async () => {
        const p = main_1.greeter(name);
        jest.runOnlyPendingTimers();
        hello = await p;
    });
    // Assert if setTimeout was called properly
    it('delays the greeting by 2 seconds', () => {
        expect(setTimeout.mock.calls.length).toBe(1);
        expect(setTimeout.mock.calls[0][1]).toBe(main_1.Delays.Long);
    });
    // Assert greeter result
    it('greets a user with `Hello, {name}` message', () => {
        expect(hello).toBe(`Hello, ${name}`);
    });
});
