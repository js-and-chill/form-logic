# form
Low-level and simple react components to handle common form logic.
```bash
yarn add form-logic
```
```bash
npm install --save form-logic
```

* [Why](#why)
* [Example](#example)
* [API](#api)

## Why
Forms are always made up of the same logic :
* Enable submit when certains values are filled
* Disable submit and/or inputs when a request is in flight, or there is an error

But the exacts prerequisites are always custom to each form.  
This library exposes 2 components : `<Form/>` and `<FormBehave/>`.  

`<Form/>` exposes a context made of `requests`, `values` and `errors`.  
`<FormBehave/>` allows to react and interact with this context.

## Example
Here is a simple form implementing most basics functionnalities :
- The header displays itself differently if the user has filled its name.
- Register button is disabled until inputs are filled
- Register button and the inputs are disabled when the request is in flight

![form-final](https://cloud.githubusercontent.com/assets/8074336/22705609/84ecbfd2-ed6c-11e6-8ebf-8823b9097504.gif)

```js
<Form>
  <FormBehave render={({ values }) => (
    <h1>
      {values.name
        ? `Hello, ${values.name} !`
        : 'Who are you ?'}
    </h1>
  )}/>

  <div>
    <FormBehave render={({ requests, values }, { setValue }) => (
      <Input
        type="text"
        placeholder="Name"
        value={values.name || ''}
        onChange={(e) => setValue('name', e.target.value)}
        disabled={!!requests.register}
      />
    )}/>

    <FormBehave render={({ requests, values }, { setValue }) => (
      <Input
        type="text"
        placeholder="Last name"
        value={values.lastName || ''}
        onChange={(e) => setValue('lastName', e.target.value)}
        disabled={!!requests.register}
      />
    )}/>
  </div>

  <FormBehave render={({ requests, values }, { registerRequest }) => (
    <Button
      onClick={() => registerRequest('register', this.register())}
      disabled={!values.name || !values.lastName || requests.register}
    >
      {!!requests.register
        ? 'Registering...'
        : 'Register !'}
    </Button>
  )}/>
</Form>
```

## API
* `<Form/>` Provides context for any `<FormBehave/>` children.
*  `<FormBehave render={fn} />`
  * prop **render** *(FormData, FormContext) => ?React$Element*
```js
type FormData = {
  requests: {
    [key: string]: Promise<any>,
  },
  values: {
    [key: string]: any,
  },
  errors: {
    [key: string]: string,
  },
};
```
```js
type FormContext = {
  registerRequest: (string, Promise<any>) => void,
  setValue: (string, any) => void,
  setError: (string, any) => void,
};
```
      
