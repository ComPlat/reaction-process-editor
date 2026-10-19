import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ClapUploadButton from '../../../components/reactions/navbar/ClapUploadButton';
import NotificationContext from '../../../contexts/NotificationContext';

const mockUploadClap = jest.fn();

jest.mock('../../../fetchers/ReactionsFetcher', () => ({
  useReactionsFetcher: () => ({ uploadClap: mockUploadClap }),
}));

describe('reaction 2 Send to Lab', () => {
  beforeEach(() => {
    mockUploadClap.mockReset();
  });

  test('posts the reaction CLAP export to the configured laboratory endpoint', async () => {
    const response = { uploaded: true, upstream_status: 201 };
    const addNotification = jest.fn();
    mockUploadClap.mockResolvedValue(response);

    render(
      <NotificationContext.Provider value={{ addNotification }}>
        <ClapUploadButton reactionProcessId="reaction-2" />
      </NotificationContext.Provider>
    );
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
    await waitFor(() => expect(addNotification).toHaveBeenCalledWith({
        title: 'Send to Lab',
        message: JSON.stringify(response),
        type: 'success',
      }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Send to Lab' })).toBeEnabled());
  });

  test('does not display a success notification for a failed upload', async () => {
    const addNotification = jest.fn();
    mockUploadClap.mockResolvedValue({});

    render(
      <NotificationContext.Provider value={{ addNotification }}>
        <ClapUploadButton reactionProcessId="reaction-2" />
      </NotificationContext.Provider>
    );
    userEvent.click(screen.getByRole('button', { name: 'Send to Lab' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Send to Lab' })).toBeEnabled());
    expect(addNotification).not.toHaveBeenCalled();
  });
});
