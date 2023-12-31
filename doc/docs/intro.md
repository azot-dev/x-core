---
sidebar_position: 1
---

# Motivation

The full documentation can be found [here](https://azot-dev.github.io/x-core/docs/get-started)



## Why this library ?

As a React Native developer, I struggled for a long time finding the right architecture, contrary to the web developers, I had to deal with a lot of logic in my app (bluetooth, offline mode)

Trying to optimize my code, RTK Query, React Query, but I figured out that the API is not the only external dependency of the app and the cache can't be trusted as a store in many projects I worked on.

So I tried clean architecture with Redux Toolkit, very nice but still hard to read for developers who don't master clean architecture principles.

I ended up with the X-Core architecture, in order to help developers (and myself) to gain more readability over their code, help them test it easily, and not being stopped by any issue the could encounter.

X-Core is easy to use, and can be setup at the architecture complexity you want.
## Purpose

React is a library not a framework, it has been created to reflect the changes of some variables (the states) to the UI, nothing else.
x-core comes as the missing brick of React, and will give all the keys to create the perfect architecture of your app, keeping your code readable and your app scalable.

With this you could:

- share your code between React and React Native (and any other JS framework)
- test your logic directly with Jest (no more react-testing-library to test your data over the UI)
- code in test driven development (TDD)
- create a clean architecture with the port/adapter pattern
- keep each part of your logic well separated thanks to services

All of that using oriented object programming!

## Technical choices

It is built over [the legend app state lib](https://legendapp.com/open-source/state/), and add a strongly typed system of services and dependency injections

## Basic example

### Create a store

```typescript
type Store = {
  counter: number;
}

export const myStore: Store = {
  counter: 0,
};
```

### Create the services

```typescript
class CounterService extends Service {
  increment() {
    this.store.counter.set(counter => counter + 1);
  }
  
  decrement() {
    this.store.counter.set(counter => counter === 0 ? 0 : counter - 1);
  }

  setValue(value: number) {
    this.store.counter.set(value)
  }
}

export const services = {
  counter: CounterService,
};
```

### Create your core

```typescript
const Core = createCoreFactory<{}>()(myStore, services);
```

### Instanciate the core

```typescript
const AppWrapper = () => {
  return (
    <XCoreProvider coreInstance={new Core()}>
      <App />
    </XCoreProvider>
  );
};
```

### Access the store data and the services in your app

```typescript
// App.tsx

const App = () => {
  const counter = useAppSelector((state) => state.counter);
  const { increment, decrement } = useAppService('counter');
  
  return (
    <button onClick={() => increment()}> - </button>
    <div>{counter}</div>
    <button onClick={() => decrement()}> + </button>
  );
};

```

### Test your code logic
In test driven development (TDD), this file should be created before coding the method services

```typescript
// counter.spec.ts

describe('counter', () => {
  let core = new Core();

  beforeEach(() => {
    core = new Core()
  })

  it('should be incremented', () => {
    expect(core.store.counter.get()).toBe(0)

    core.services.counter.increment()
    expect(core.store.counter.get()).toBe(1)

    core.services.counter.increment()
    expect(core.store.counter.get()).toBe(2)
  })

  it('should be decremented', () => {
    core.services.counter.setValue(5)

    core.services.counter.decrement()
    expect(core.store.counter.get()).toBe(4)

    core.services.counter.decrement()
    expect(core.store.counter.get()).toBe(3)
  })

  it('should not be decremented at a lower value than 0', () => {
    core.services.counter.setValue(1)

    core.services.counter.decrement()
    expect(core.store.counter.get()).toBe(0)

    core.services.counter.decrement()
    expect(core.store.counter.get()).toBe(0)
  })
}) 
