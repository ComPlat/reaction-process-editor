import { render, screen } from '@testing-library/react';

import FormButtons from '../../../components/utilities/FormButtons';

describe('FormButtons', () => {
  test('normalizes a blocking form name to boolean disabled props', () => {
    render(
      <FormButtons
        disabled="Description"
        onCancel={jest.fn()}
        onSave={jest.fn()}
        type="action"
      />
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});
