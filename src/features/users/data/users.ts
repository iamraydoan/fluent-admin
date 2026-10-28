import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(67890)

export const users = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'invited',
      'suspended',
      'locked',
      'expired',
    ]),
    role: faker.helpers.arrayElement([
      'superadmin',
      'admin',
      'cashier',
      'manager',
    ]),
    department: faker.helpers.arrayElement([
      'Engineering',
      'Sales',
      'Operations',
      'Finance',
      'Support',
      'Human Resources',
      'Marketing',
      'Product',
    ]),
    jobTitle: faker.person.jobTitle(),
    manager: faker.person.fullName(),
    accountType: faker.helpers.arrayElement([
      'internal',
      'external',
      'service',
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
