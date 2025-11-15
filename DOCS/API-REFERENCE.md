# API Reference

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [GraphQL Endpoint](#graphql-endpoint)
- [Schema Overview](#schema-overview)
- [Type Definitions](#type-definitions)
- [Queries](#queries)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Best Practices](#best-practices)
- [Code Examples](#code-examples)

---

## Overview

The Minimalist CV application exposes a **GraphQL API** that provides programmatic access to resume data. This API allows external applications, portfolio websites, or automation tools to fetch structured resume information.

### API Details

| Property | Value |
|----------|-------|
| **Protocol** | GraphQL over HTTP |
| **Endpoint** | `/graphql` |
| **Methods** | `GET`, `POST` |
| **Authentication** | None (public data) |
| **Rate Limiting** | None (subject to hosting limits) |
| **Versioning** | Not versioned (stable schema) |

### Key Features

- **Type-safe schema** - Built with TypeGraphQL and TypeScript
- **Introspection** - Schema exploration in development mode
- **Error handling** - Consistent error format
- **Single query** - All resume data in one request
- **No authentication** - Resume data is intentionally public

---

## Getting Started

### Prerequisites

- HTTP client capable of making GraphQL requests (curl, Postman, Apollo Client, etc.)
- Basic understanding of GraphQL syntax

### Quick Start

**1. Access the GraphQL Playground** (Development Only)

```
http://localhost:3000/graphql
```

**2. Run your first query:**

```graphql
query GetName {
  me {
    name
  }
}
```

**3. Expected response:**

```json
{
  "data": {
    "me": {
      "name": "Ban Nguyen"
    }
  }
}
```

---

## GraphQL Endpoint

### Endpoint URL

**Development**:
```
http://localhost:3000/graphql
```

**Production**:
```
https://your-domain.com/graphql
```

### HTTP Methods

#### POST Request (Recommended)

```http
POST /graphql
Content-Type: application/json

{
  "query": "query { me { name } }"
}
```

#### GET Request

```http
GET /graphql?query={me{name}}
```

### Headers

**Required**:
```
Content-Type: application/json
```

**Optional**:
```
Accept: application/json
```

### Response Format

**Success Response**:
```json
{
  "data": {
    "me": { /* ... */ }
  }
}
```

**Error Response**:
```json
{
  "errors": [
    {
      "message": "Error description",
      "path": ["me", "field"],
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ]
}
```

---

## Schema Overview

### Root Types

The API has a single root type:

```graphql
type Query {
  me: Me!
}
```

### Complete Schema Diagram

```
Query
└── me: Me!
    ├── name: String!
    ├── initials: String!
    ├── location: String!
    ├── locationLink: String!
    ├── about: String!
    ├── summary: String!
    ├── avatarUrl: String!
    ├── personalWebsiteUrl: String!
    ├── contact: Contact!
    │   ├── email: String!
    │   ├── tel: String!
    │   └── social: [Social!]!
    │       ├── name: String!
    │       └── url: String!
    ├── education: [Education!]!
    │   ├── school: String!
    │   ├── degree: String!
    │   ├── start: String!
    │   └── end: String!
    ├── work: [Work!]!
    │   ├── company: String!
    │   ├── link: String!
    │   ├── badges: [String!]!
    │   ├── title: String!
    │   ├── start: String!
    │   ├── end: String!
    │   └── description: String!
    ├── skills: [String!]!
    └── projects: [Project!]!
        ├── title: String!
        ├── techStack: [String!]!
        ├── description: String!
        └── link: Link
            ├── label: String!
            └── href: String!
```

---

## Type Definitions

### Me

The root type containing all resume information.

```graphql
type Me {
  """
  Full name of the person
  """
  name: String!

  """
  Initials (e.g., "BN" for "Ban Nguyen")
  """
  initials: String!

  """
  Current location (e.g., "Ho Chi Minh City, Viet Nam")
  """
  location: String!

  """
  Google Maps link to location
  """
  locationLink: String!

  """
  Short professional tagline (e.g., "Product Manager")
  """
  about: String!

  """
  Professional summary or bio
  """
  summary: String!

  """
  URL to avatar/profile picture
  """
  avatarUrl: String!

  """
  Personal website URL
  """
  personalWebsiteUrl: String!

  """
  Contact information
  """
  contact: Contact!

  """
  Educational background (chronological order, newest first)
  """
  education: [Education!]!

  """
  Work experience (chronological order, newest first)
  """
  work: [Work!]!

  """
  List of skills
  """
  skills: [String!]!

  """
  Highlight projects or achievements
  """
  projects: [Project!]!
}
```

**Example**:
```graphql
query {
  me {
    name
    initials
    location
    about
  }
}
```

**Response**:
```json
{
  "data": {
    "me": {
      "name": "Ban Nguyen",
      "initials": "BN",
      "location": "Ho Chi Minh City, Viet Nam",
      "about": "Product Manager"
    }
  }
}
```

---

### Contact

Contact information including email, phone, and social links.

```graphql
type Contact {
  """
  Email address
  """
  email: String!

  """
  Phone number (with country code)
  """
  tel: String!

  """
  Social media profiles
  """
  social: [Social!]!
}
```

**Example**:
```graphql
query {
  me {
    contact {
      email
      tel
      social {
        name
        url
      }
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "me": {
      "contact": {
        "email": "nguyenducban@me.com",
        "tel": "+84983472120",
        "social": [
          {
            "name": "GitHub",
            "url": "https://github.com/ban-nguyen"
          },
          {
            "name": "LinkedIn",
            "url": "https://www.linkedin.com/in/ban-nguyen/"
          }
        ]
      }
    }
  }
}
```

---

### Social

Social media profile information.

```graphql
type Social {
  """
  Platform name (e.g., "GitHub", "LinkedIn")
  """
  name: String!

  """
  Profile URL
  """
  url: String!
}
```

---

### Education

Educational background entry.

```graphql
type Education {
  """
  Name of educational institution
  """
  school: String!

  """
  Degree and field of study
  """
  degree: String!

  """
  Start year
  """
  start: String!

  """
  End year (or "Present" if ongoing)
  """
  end: String!
}
```

**Example**:
```graphql
query {
  me {
    education {
      school
      degree
      start
      end
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "me": {
      "education": [
        {
          "school": "Swiss International University",
          "degree": "Bachelor's Degree, Marketing",
          "start": "2016",
          "end": "2018"
        },
        {
          "school": "Tay Nguyen University",
          "degree": "Bachelor's Degree, Faculty of Agriculture and Forestry",
          "start": "1997",
          "end": "2001"
        }
      ]
    }
  }
}
```

---

### Work

Work experience entry.

```graphql
type Work {
  """
  Company name
  """
  company: String!

  """
  Company website URL
  """
  link: String!

  """
  Technology or domain tags (e.g., ["AI", "Fintech"])
  """
  badges: [String!]!

  """
  Job title
  """
  title: String!

  """
  Start year
  """
  start: String!

  """
  End year (or "Present" if current role)
  """
  end: String!

  """
  Job description and achievements
  """
  description: String!
}
```

**Example**:
```graphql
query {
  me {
    work {
      company
      title
      start
      end
      badges
      description
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "me": {
      "work": [
        {
          "company": "MoMo (M_Service)",
          "title": "Product Management - Team Leader",
          "start": "2024",
          "end": "Present",
          "badges": ["AI", "Fintech", "Travel"],
          "description": "Led product strategy for MoMo Travel..."
        }
      ]
    }
  }
}
```

---

### Project

Project or achievement entry.

```graphql
type Project {
  """
  Project title
  """
  title: String!

  """
  Technologies or categories
  """
  techStack: [String!]!

  """
  Project description
  """
  description: String!

  """
  External link (optional)
  """
  link: Link
}
```

**Example**:
```graphql
query {
  me {
    projects {
      title
      techStack
      description
      link {
        label
        href
      }
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "me": {
      "projects": [
        {
          "title": "Human Act Prize 2024",
          "techStack": ["Social Impact", "Strategic Value Alignment"],
          "description": "Won the Human Act Prize...",
          "link": {
            "label": "Human Act Prize",
            "href": "https://www.humanactprize.org/"
          }
        }
      ]
    }
  }
}
```

---

### Link

External link with label.

```graphql
type Link {
  """
  Link text/label
  """
  label: String!

  """
  URL
  """
  href: String!
}
```

---

## Queries

### Get Complete Resume

Fetch all resume data in a single query.

**Query**:
```graphql
query GetCompleteResume {
  me {
    # Personal Information
    name
    initials
    location
    locationLink
    about
    summary
    avatarUrl
    personalWebsiteUrl

    # Contact
    contact {
      email
      tel
      social {
        name
        url
      }
    }

    # Education
    education {
      school
      degree
      start
      end
    }

    # Work Experience
    work {
      company
      link
      badges
      title
      start
      end
      description
    }

    # Skills
    skills

    # Projects
    projects {
      title
      techStack
      description
      link {
        label
        href
      }
    }
  }
}
```

**Use Case**: Display complete resume on a portfolio website

---

### Get Basic Information

Fetch only name, title, and contact info.

**Query**:
```graphql
query GetBasicInfo {
  me {
    name
    about
    contact {
      email
    }
  }
}
```

**Response**:
```json
{
  "data": {
    "me": {
      "name": "Ban Nguyen",
      "about": "Product Manager",
      "contact": {
        "email": "nguyenducban@me.com"
      }
    }
  }
}
```

**Use Case**: Display brief bio on a homepage

---

### Get Work Experience Only

Fetch employment history.

**Query**:
```graphql
query GetWorkExperience {
  me {
    name
    work {
      company
      title
      start
      end
      description
    }
  }
}
```

**Use Case**: Generate a LinkedIn profile summary

---

### Get Skills and Projects

Fetch technical skills and highlight projects.

**Query**:
```graphql
query GetSkillsAndProjects {
  me {
    skills
    projects {
      title
      techStack
      description
    }
  }
}
```

**Use Case**: Populate a skills section on a portfolio

---

### Get Contact Information

Fetch all contact methods.

**Query**:
```graphql
query GetContact {
  me {
    name
    contact {
      email
      tel
      social {
        name
        url
      }
    }
    personalWebsiteUrl
  }
}
```

**Use Case**: Display contact options on a "Get in Touch" page

---

### Get Education Background

Fetch educational credentials.

**Query**:
```graphql
query GetEducation {
  me {
    name
    education {
      school
      degree
      start
      end
    }
  }
}
```

**Use Case**: Verify educational background

---

## Error Handling

### Error Response Format

All errors follow a consistent structure:

```json
{
  "errors": [
    {
      "message": "Error description",
      "path": ["fieldPath"],
      "locations": [{ "line": 2, "column": 3 }],
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ],
  "data": null
}
```

### Common Error Codes

#### GRAPHQL_VALIDATION_FAILED

**Cause**: Invalid GraphQL syntax

**Example**:
```graphql
query {
  me {
    invalidField  # Field doesn't exist
  }
}
```

**Response**:
```json
{
  "errors": [
    {
      "message": "Cannot query field 'invalidField' on type 'Me'.",
      "extensions": {
        "code": "GRAPHQL_VALIDATION_FAILED"
      }
    }
  ]
}
```

**Solution**: Check field names against schema

---

#### INTERNAL_SERVER_ERROR

**Cause**: Server-side error

**Production Response**:
```json
{
  "errors": [
    {
      "message": "Internal server error",
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR"
      }
    }
  ]
}
```

**Development Response**:
```json
{
  "errors": [
    {
      "message": "Detailed error message with stack trace",
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR"
      }
    }
  ]
}
```

**Solution**: Report to developers

---

#### BAD_REQUEST

**Cause**: Malformed request body

**Example**:
```http
POST /graphql
Content-Type: application/json

{ invalid json }
```

**Response**:
```json
{
  "errors": [
    {
      "message": "Unexpected token in JSON",
      "extensions": {
        "code": "BAD_REQUEST"
      }
    }
  ]
}
```

**Solution**: Validate JSON syntax

---

### Error Handling Best Practices

**1. Always check for errors**:
```javascript
const response = await fetch('/graphql', { /* ... */ });
const result = await response.json();

if (result.errors) {
  // Handle errors
  console.error('GraphQL errors:', result.errors);
  return;
}

// Use data
const resume = result.data.me;
```

**2. Partial data handling**:
```javascript
// Some queries may return partial data with errors
if (result.errors) {
  console.warn('Partial errors:', result.errors);
}

if (result.data) {
  // Use whatever data is available
  const resume = result.data.me;
}
```

**3. User-friendly messages**:
```javascript
function getUserFriendlyError(errors) {
  if (!errors || errors.length === 0) return null;

  const error = errors[0];

  switch (error.extensions?.code) {
    case 'GRAPHQL_VALIDATION_FAILED':
      return 'Invalid request. Please try again.';
    case 'INTERNAL_SERVER_ERROR':
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}
```

---

## Rate Limiting

### Current Status

**Rate limiting is NOT enforced** at the application level.

### Hosting Limits

Rate limiting may be imposed by the hosting provider:

**Vercel (Hobby Plan)**:
- **Bandwidth**: 100 GB/month
- **Invocations**: 100,000/month (serverless functions)
- **Fair Use Policy**: Applied

**Recommended Client-Side Practices**:

1. **Cache responses**:
   ```javascript
   // Cache for 5 minutes
   const cache = new Map();
   const CACHE_TTL = 5 * 60 * 1000;

   async function fetchResume() {
     const cached = cache.get('resume');
     if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
       return cached.data;
     }

     const data = await fetch('/graphql', { /* ... */ });
     cache.set('resume', { data, timestamp: Date.now() });
     return data;
   }
   ```

2. **Batch requests**:
   ```graphql
   # Instead of multiple requests, fetch everything once
   query {
     me {
       name
       work { ... }
       education { ... }
       skills
       projects { ... }
     }
   }
   ```

3. **Use pagination** (if implemented):
   ```graphql
   # Not currently implemented, but best practice
   query {
     work(limit: 10, offset: 0) {
       ...
     }
   }
   ```

---

## Best Practices

### Query Optimization

**1. Request only needed fields**:

```graphql
# ✅ GOOD - Request only what you need
query {
  me {
    name
    contact {
      email
    }
  }
}

# ❌ BAD - Requesting everything
query {
  me {
    name
    initials
    location
    locationLink
    about
    summary
    # ... (requesting all fields when you only need name and email)
  }
}
```

**2. Use fragments for reusability**:

```graphql
fragment BasicInfo on Me {
  name
  about
  contact {
    email
  }
}

query {
  me {
    ...BasicInfo
  }
}
```

**3. Name your queries**:

```graphql
# ✅ GOOD - Named query
query GetUserName {
  me {
    name
  }
}

# ❌ BAD - Anonymous query
query {
  me {
    name
  }
}
```

---

### Caching Strategies

**1. HTTP Caching**:

```javascript
// Set cache headers
fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300', // 5 minutes
  },
  body: JSON.stringify({ query: '...' }),
});
```

**2. Client-Side Caching**:

```javascript
// Apollo Client example
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          me: {
            // Cache for 5 minutes
            read(existing, { toReference }) {
              return existing;
            },
          },
        },
      },
    },
  }),
});
```

---

### Security Considerations

**1. Avoid exposing sensitive data in queries**:

This API intentionally exposes public resume data. No authentication is required.

**2. Validate responses client-side**:

```typescript
interface ResumeData {
  name: string;
  contact: {
    email: string;
    // ...
  };
}

function validateResume(data: any): data is ResumeData {
  return (
    typeof data.name === 'string' &&
    typeof data.contact?.email === 'string'
  );
}

const result = await fetchResume();
if (validateResume(result.data.me)) {
  // Safe to use
} else {
  // Invalid data
}
```

**3. Use HTTPS in production**:

```javascript
// ✅ GOOD
const API_URL = 'https://your-domain.com/graphql';

// ❌ BAD (only for local development)
const API_URL = 'http://localhost:3000/graphql';
```

---

## Code Examples

### JavaScript (Fetch API)

```javascript
async function getResume() {
  const query = `
    query {
      me {
        name
        about
        contact {
          email
          social {
            name
            url
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://your-domain.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return null;
    }

    return result.data.me;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

// Usage
const resume = await getResume();
console.log(resume.name); // "Ban Nguyen"
```

---

### TypeScript (with Types)

```typescript
interface Social {
  name: string;
  url: string;
}

interface Contact {
  email: string;
  tel: string;
  social: Social[];
}

interface Resume {
  name: string;
  about: string;
  contact: Contact;
}

async function getResume(): Promise<Resume | null> {
  const query = `
    query GetResume {
      me {
        name
        about
        contact {
          email
          tel
          social {
            name
            url
          }
        }
      }
    }
  `;

  const response = await fetch('https://your-domain.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.me;
}
```

---

### React (with Hooks)

```typescript
import { useState, useEffect } from 'react';

interface Resume {
  name: string;
  about: string;
  contact: {
    email: string;
  };
}

function useResume() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const query = `
          query {
            me {
              name
              about
              contact { email }
            }
          }
        `;

        const response = await fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setResume(result.data.me);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchResume();
  }, []);

  return { resume, loading, error };
}

// Usage in component
function ResumeDisplay() {
  const { resume, loading, error } = useResume();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!resume) return null;

  return (
    <div>
      <h1>{resume.name}</h1>
      <p>{resume.about}</p>
      <a href={`mailto:${resume.contact.email}`}>
        {resume.contact.email}
      </a>
    </div>
  );
}
```

---

### Apollo Client (React)

```typescript
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

// Setup Apollo Client
const client = new ApolloClient({
  uri: 'https://your-domain.com/graphql',
  cache: new InMemoryCache(),
});

// Define query
const GET_RESUME = gql`
  query GetResume {
    me {
      name
      about
      contact {
        email
        social {
          name
          url
        }
      }
      work {
        company
        title
        start
        end
      }
    }
  }
`;

// Component
function Resume() {
  const { loading, error, data } = useQuery(GET_RESUME);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const resume = data.me;

  return (
    <div>
      <header>
        <h1>{resume.name}</h1>
        <p>{resume.about}</p>
        <a href={`mailto:${resume.contact.email}`}>Contact</a>
      </header>

      <section>
        <h2>Work Experience</h2>
        {resume.work.map((job, i) => (
          <div key={i}>
            <h3>{job.title} at {job.company}</h3>
            <p>{job.start} - {job.end}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
```

---

### Node.js (Server-Side)

```javascript
const fetch = require('node-fetch');

async function getResume() {
  const query = `
    query {
      me {
        name
        work {
          company
          title
        }
      }
    }
  `;

  const response = await fetch('https://your-domain.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  return result.data.me;
}

// Usage
getResume().then((resume) => {
  console.log(`Name: ${resume.name}`);
  resume.work.forEach((job) => {
    console.log(`- ${job.title} at ${job.company}`);
  });
});
```

---

### Python

```python
import requests
import json

def get_resume():
    url = 'https://your-domain.com/graphql'
    query = '''
        query {
            me {
                name
                about
                contact {
                    email
                }
            }
        }
    '''

    response = requests.post(
        url,
        json={'query': query},
        headers={'Content-Type': 'application/json'}
    )

    result = response.json()

    if 'errors' in result:
        raise Exception(result['errors'][0]['message'])

    return result['data']['me']

# Usage
resume = get_resume()
print(f"Name: {resume['name']}")
print(f"Email: {resume['contact']['email']}")
```

---

### cURL

```bash
curl -X POST https://your-domain.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { me { name contact { email } } }"
  }'
```

**With formatted query**:
```bash
curl -X POST https://your-domain.com/graphql \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "query": "query GetResume { me { name about contact { email tel social { name url } } } }"
}
EOF
```

---

## Introspection

### Get Schema (Development Only)

Introspection is enabled in development mode:

```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

### Get Type Information

```graphql
query GetTypeInfo {
  __type(name: "Me") {
    name
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
```

**Note**: Introspection is **disabled in production** for security.

---

## Changelog

### Version 1.0 (Current)

**Initial Release**:
- Single query endpoint: `me`
- Complete resume data access
- No authentication required
- No rate limiting

**Future Considerations**:
- Pagination for work/education arrays
- Filtering by date range
- Multiple resume profiles
- Localization support

---

## Support

### Issues

Report API issues:
- GitHub Issues: [Project Repository](https://github.com/username/minimalist-cv)
- Email: Contact information in resume

### Feature Requests

Submit GraphQL API feature requests via GitHub Issues.

---

## Additional Resources

- [GraphQL Official Documentation](https://graphql.org/learn/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [TypeGraphQL Documentation](https://typegraphql.com/)
- [Project Technical Documentation](/home/user/minimalist-cv/DOCS/TECHNICAL-DOCS.md)
- [Architecture Documentation](/home/user/minimalist-cv/DOCS/ARCHITECTURE.md)

---

**Last Updated**: 2025-11-15
**API Version**: 1.0
**Status**: Stable
