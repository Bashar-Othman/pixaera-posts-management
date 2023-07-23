import { check, fail, group } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';
import formUrlencoded from 'https://jslib.k6.io/form-urlencoded/3.0.0/index.js';
import faker from 'https://unpkg.com/faker@5.1.0/dist/faker.js';
import Ajv from 'https://jslib.k6.io/ajv/6.12.5/index.js';

const paginationSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
    },
    meta: {
      type: 'object',
      properties: {
        itemCount: {
          type: 'number',
        },
        totalItems: {
          type: 'number',
        },
        itemsPerPage: {
          type: 'number',
        },
        totalPages: {
          type: 'number',
        },
        currentPage: {
          type: 'number',
        },
      },
      required: [
        'itemCount',
        'totalItems',
        'itemsPerPage',
        'totalPages',
        'currentPage',
      ],
    },
    links: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
        },
        previous: {
          type: 'string',
        },
        next: {
          type: 'string',
        },
        last: {
          type: 'string',
        },
      },
    },
  },
};
const ajv = new Ajv({ allErrors: true });
const validatePagination = ajv.compile(paginationSchema);

const createPostMFailedRate = new Rate('failed create PostM request');
const updatePostMFailedRate = new Rate('failed update PostM request');
const donePostMFailedRate = new Rate('failed mark PostM as done request');
const pendingPostMFailedRate = new Rate('failed mark PostM as pending request');
const deletePostMFailedRate = new Rate('failed delete PostM request');

export function requestPostMWorkflow(baseUrl, token) {
  group('Create a new PostM', () => {
    const payload = formUrlencoded({ text: faker.lorem.sentence() });
    const params = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    };

    const res = http.post(
      `${baseUrl}/PostM`,
      payload,
      Object.assign({ responseType: 'text' }, params),
    );

    const result = check(res, {
      'PostM created successfully': res => res.status === 201,
      'JSON response': res => /json/.test(res.headers['Content-Type']),
    });

    if (!result) {
      createPostMFailedRate.add(1);
      fail('failed to create one PostM');
    }

    const PostM = res.json();

    group('Get one PostM', () => {
      const res = http.get(`${baseUrl}/PostM/${PostM.id}`, params);

      check(res, {
        'PostM retrieved successfully': res => res.status === 200,
        'JSON response': res => /json/.test(res.headers['Content-Type']),
      });
    });

    group('Update one PostM', () => {
      const payload = formUrlencoded({ text: faker.lorem.sentence() });
      const res = http.put(`${baseUrl}/PostM/${PostM.id}`, payload, params);

      const result = check(res, {
        'PostM updated successfully': res => res.status === 200,
        'JSON response': res => /json/.test(res.headers['Content-Type']),
      });
      updatePostMFailedRate.add(!result);
    });

    group('Mark one PostM as done', () => {
      const res = http.patch(`${baseUrl}/PostM/${PostM.id}/done`, null, params);

      const result = check(res, {
        'PostM marked as done successfully': res => res.status === 200,
        'JSON response': res => /json/.test(res.headers['Content-Type']),
      });
      donePostMFailedRate.add(!result);

      group('Mark one PostM as pending', () => {
        const res = http.patch(
          `${baseUrl}/PostM/${PostM.id}/pending`,
          null,
          params,
        );

        const result = check(res, {
          'PostM marked as pending successfully': res => res.status === 200,
          'JSON response': res => /json/.test(res.headers['Content-Type']),
        });
        pendingPostMFailedRate.add(!result);

        group('Remove one PostM', () => {
          const res = http.del(`${baseUrl}/PostM/${PostM.id}`, null, params);

          const result = check(res, {
            'PostM removed successfully': res => res.status === 204,
          });

          deletePostMFailedRate.add(!result);
        });
      });
    });
  });
}

export function requestUnauthorizedPostM(baseUrl) {
  group('Require authentication', () => {
    const responses = http.batch([
      {
        url: `${baseUrl}/PostM`,
        method: 'POST',
        body: {
          text: 'Hack the server',
        },
        params: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      },
      {
        url: `${baseUrl}/PostM`,
        method: 'GET',
      },
      {
        url: `${baseUrl}/PostM/2`,
        method: 'GET',
      },
      {
        url: `${baseUrl}/PostM/2`,
        method: 'PUT',
        body: {
          text: 'You have been hacked',
        },
        params: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      },
      {
        url: `${baseUrl}/PostM/2/done`,
        method: 'PATCH',
      },
      {
        url: `${baseUrl}/PostM/2/pending`,
        method: 'PATCH',
      },
      {
        url: `${baseUrl}/PostM/2`,
        method: 'DELETE',
      },
    ]);

    check(responses, {
      'status is UNAUTHORIZED': responses =>
        responses.every(({ status }) => status === 401),
    });
  });
}

export function requestListPostM(baseUrl, token) {
  const params = {
    responseType: 'text',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  group('List all PostMs', () => {
    const res = http.get(`${baseUrl}/PostM`, params);

    const result = check(res, {
      'PostM listed successfully': res => res.status === 200,
      'JSON response': res => /json/.test(res.headers['Content-Type']),
      'PostM list is paginated': res => {
        const valid = validatePagination(res.json());

        return !!valid;
      },
    });
    createPostMFailedRate.add(!result);
  });
}
