import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ClapUploadButton from '../../../components/reactions/navbar/ClapUploadButton';

const mockUploadClap = jest.fn();

jest.mock('../../../fetchers/ReactionsFetcher', () => ({
  useReactionsFetcher: () => ({ uploadClap: mockUploadClap }),
}));

describe('reaction 2 Send to Lab', () => {
  beforeEach(() => {
    mockUploadClap.mockReset();
  });

  test('posts the reaction CLAP export to the configured laboratory endpoint', async () => {
    mockUploadClap.mockResolvedValue({ uploaded: true, upstream_status: 201 });

    render(<ClapUploadButton reactionProcessId="reaction-2" />);
    const uploadButton = screen.getByRole('button', { name: 'Send to Lab' });
    expect(uploadButton).toHaveAttribute(
      'title',
      'Send the reaction to the configured laboratory endpoint.'
    );
    expect(uploadButton).toHaveClass('btn-lg');
    expect(uploadButton.querySelector('[data-icon="upload"]')).toBeInTheDocument();
    userEvent.click(uploadButton);

    expect(uploadButton).toBeDisabled();
    await waitFor(() => expect(mockUploadClap).toHaveBeenCalledWith('reaction-2'));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Send to Lab' })).toBeEnabled());
  });

  test('re-enables the upload button after a failed upload', async () => {
    mockUploadClap.mockResolvedValue({});

    render(<ClapUploadButton reactionProcessId="reaction-2" />);
    userEvent.click(screen.getByRole('button', { name: 'Send to Lab' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Send to Lab' })).toBeEnabled());
  });
});
