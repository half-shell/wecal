# Wecal

Wecal is a small tool to find the first available time slots for meeting given a list of
booked time slots.

## Code review

1.

```js
const data = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
  { value: "3", label: "Three" },
];

const values = data.reduce((values, { value }) => {
  values.push(value);
  return values;
}, []);
```

A `Array.reduce()` function is not needed. We can simplify it a bit with a `Array.map()`
function instead:

```js
const values = data.map({ value } => value);
```

2.

```js
async function getIndexes() {
   return await fetch('https://api.coingecko.com/api/v3/indexes').then(res => res.json());
}

async function analyzeIndexes() {
   const indexes = await getIndexes().catch(_ => {
      throw new Error('Unable to fetch indexes');
   });
   return indexes;
}
```

Mixing both async and Promise syntaxes is pretty hard to read. If we take the async/await
path, something a bit more straightforward would be:

```js
 function getIndexes() {
     return fetch('https://api.coingecko.com/api/v3/indexes');
 }

async function analyzeIndexes() {
    try {
        const indexes = await getIndexes().catch(_ => {

        });
        return indexes;
    } catch(e) {
        throw new Error('Unable to fetch indexes');
    }
}
```
Note also that we donc need to make `getIndexes()` async if we make it return a `Promise`.

3.

```js
let state;
const user = getUser();
if (user) {
   const project = getProject(user.id);
   state = {
       user,
       project
   };
} else {
   state = {
      user: null,
      project: null
   };
}
ctx.body = state;
```

We can try here to make the default values of state a bit more obvious by using the spread
operator:

```js
const state = {
    user: null,
    project: nulls
};

const user = getUser();

if (user) {
    const project = getProject(user.id);

    state = {
        ...state,
        user,
        project,
    }
}

ctx.body = date


```

4.

```js
function getQueryProvider() {
  const url = window.location.href;
  const [_, provider] = url.match(/provider=([^&]*)/);
  if (provider) {
     return provider;
  }
  return;
}
```

Here we can simplify the return statement, since the second return statement `return;`
will return undefined in that case.

```js
function getQueryProvider() {
  const url = window.location.href;
  const [_, provider] = url.match(/provider=([^&]*)/);

    return provider;
}
```

5.

```js
function getParagraphTexts() {
   const texts = [];
   document.querySelectorAll("p").forEach(p => {
      texts.push(p);
   });
   return texts;
}
```

This works, but since `querySelectorAll()` returns a
[NodeList](https://developer.mozilla.org/fr/docs/Web/API/NodeList), we can straight up use
`Array.from()` as mentionned in the documentation, to return an array of Elements.

```js
function getParagraphTexts() {
    return Array.from(document.querySelectorAll("p"));
}
```

6.

```js
function Employee({ id }) {
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(true);
   const [employee, setEmployee] = useState({});

   useEffect(() => {
      getEmployee(id)
         .then(employee => {
            setEmployee(employee);
            setLoading(false);
         })
         .catch(_ => {
            setError('Unable to fetch employee');
            setLoading(false);
         });
   }, [id]);

   if (error) {
      return <Error />;
   }

   if (loading) {
      return <Loading />;
   }

   return (
      <Table>
         <Row>
            <Cell>{employee.firstName}</Cell>
            <Cell>{employee.lastName}</Cell>
            <Cell>{employee.position}</Cell>
            <Cell>{employee.project}</Cell>
            <Cell>{employee.salary}</Cell>
            <Cell>{employee.yearHired}</Cell>
            <Cell>{employee.wololo}</Cell>
         </Row>
      </Table>
   );
}
```

Since `setLoading(false)` is called with the same argument no matter what here, we could
put it into a `finally()` call. We could even also use a `async/await` syntax with
`try/catch/finally` to obtain a similar result.

```js
function Employee({ id }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState({});

    useEffect(() => {
        getEmployee(id)
            .then(employee => {
                setEmployee(employee);
            })
            .catch(_ => {
                setError('Unable to fetch employee');
            })
            .finally(_ => {
                setLoading(false);
            });
    }, [id]);

    if (error) {
        return <Error />;
    }

    if (loading) {
        return <Loading />;
    }

    return (
      <Table>
         <Row>
            <Cell>{employee.firstName}</Cell>
            <Cell>{employee.lastName}</Cell>
            <Cell>{employee.position}</Cell>
            <Cell>{employee.project}</Cell>
            <Cell>{employee.salary}</Cell>
            <Cell>{employee.yearHired}</Cell>
            <Cell>{employee.wololo}</Cell>
         </Row>
      </Table>
   );
}
```

7.

```js
async function getFilledIndexes() {
   try {
      const filledIndexes = [];
      const indexes = await getIndexes();
      const status = await getStatus();
      const usersId = await getUsersId();

      for (let index of indexes) {
         if (index.status === status.filled && usersId.includes(index.userId)) {
            filledIndexes.push(index);
         }
      }
      return filledIndexes;
   } catch(_) {
      throw new Error ('Unable to get indexes');
   }
}
```

It seems we're building an array of indexes matching certain conditions. We can use
`Array.filter()` here and return it straight away.

```js
async function getFilledIndexes() {
    try {
        const filledIndexes = [];
        const indexes = await getIndexes();
        const status = await getStatus();
        const usersId = await getUsersId();

        return indexes.filter(index => (index.status === status.filled && usersId.includes(index.userId)));
    } catch(_) {
        throw new Error ('Unable to get indexes');
    }
}
```

8.

```js
function getUserSettings(user) {
   if (user) {
      const project = getProject(user.id);
      if (project) {
         const settings = getSettings(project.id);
         if (settings) {
            return settings;
         }
      }
   }
   return {};
}
```

Returning early here avoids us from having so many nested `if`s, and we can use the `||`
syntax if `getSettings()` doesn't yield a result either.

```js
function getUserSettings(user) {
    if (!user) return {}

    const project = getProject(user.id);

    if (!project) return {}

    return getSettings(project.id) || {}
}
```
