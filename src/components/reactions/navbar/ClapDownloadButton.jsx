import React from 'react';
import { useReactionsFetcher } from '../../../fetchers/ReactionsFetcher';
import IconButton from "../../utilities/IconButton";

const ClapDownloadButton = ({ reactionProcessId }) => {

  const api = useReactionsFetcher();

  const downloadClap = () => {
    api.downloadClap(reactionProcessId).then((response) => {
      if (response?.headers) {

        const filename = response.headers.get('Content-Disposition').split("filename*=UTF-8''")[1];
        response.blob()
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          });
      }
    })
  }

  return (
    <div>
      <IconButton
        title="Download the reaction in CLAP/JSON format."
        icon='download'
        size='lg'
        positive={true}
        onClick={downloadClap}
        target="_blank"
      />
    </div>
  )
};

export default ClapDownloadButton;
