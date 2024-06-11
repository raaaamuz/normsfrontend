import React from 'react';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iframeHeight: '700px', // Initial height of the iframe
      iframeWidth: '100%',   // Initial width of the iframe
    };
    this.iframeRef = React.createRef();
  }

  componentDidMount() {
    // Add event listener to listen for messages from iframe
    window.addEventListener('message', this.handleMessage, false);
  }

  componentWillUnmount() {
    // Remove event listener when component unmounts
    window.removeEventListener('message', this.handleMessage);
  }

  // Function to handle messages received from iframe
  handleMessage = (event) => {
    const data = event.data;
    if (data.zohosurvey) {
      if (data.zohosurvey.action === "surveySize") {
        // Update iframe size based on message from iframe
        this.setState({
          iframeHeight: data.zohosurvey.height + 'px',
          iframeWidth: data.zohosurvey.width + 'px',
        });
      }
    }
  }

  render() {
    return (
      <div>
        <p>
          This is an example of how to use an iframe in a React component. An iframe is used to embed content from another website within the current HTML document. In this example, the iframe is dynamically resized based on messages received from the embedded survey.
        </p>
        {/* Render iframe with initial dimensions */}
        <iframe
          ref={this.iframeRef}
          src="<survey link>"
          frameborder='0'
          style={{ height: this.state.iframeHeight, width: this.state.iframeWidth }}
          marginwidth='0'
          marginheight='0'

          allow='geolocation'
        ></iframe>
      </div>
    );
  }
}

export default Test;
