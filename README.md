
# Canvas Resizer Tool

The Canvas Resizer Tool is a web-based application that allows users to upload images, resize them, and download the resized versions. The tool supports multiple file uploads and provides an intuitive user interface for managing and resizing images.

## Features

- **Upload Multiple Images**: Users can upload multiple image files at once using either the file input or drag-and-drop functionality.
- **Image Gallery**: A gallery view displays all uploaded images, allowing users to view and manage them.
- **Resize Canvas**: Users can resize the canvas of each image as needed.
- **Download Resized Images**: Users can download the resized images individually or download all of them as a ZIP archive.
- **Clear All**: Users can clear all images from the gallery with a single click.
- **Modal View**: A modal window allows users to view and resize each image in detail.

## Installation

To use the Canvas Resizer Tool, follow these steps:

1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/yourusername/canvas-resizer-tool.git
   \`\`\`
2. **Navigate to the project directory**:
   \`\`\`bash
   cd canvas-resizer-tool
   \`\`\`
3. **Open the \`index.html\` file in your web browser**:
   You can simply double-click on the \`index.html\` file, or you can run a local server using a tool like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VSCode.

## Usage

1. **Upload Images**:
   - Click on the "Choose Files" button to select images from your computer.
   - Alternatively, drag and drop images into the designated drop area.

2. **Resize Images**:
   - Click on any image in the gallery to open the modal view.
   - Use the provided controls to resize the image.

3. **Download Images**:
   - After resizing, click the "Download" button to save the resized image.
   - To download all images, click the "Download All" button in the gallery header.

4. **Clear All Images**:
   - Click the "Clear All" button to remove all images from the gallery.

## Files

- \`index.html\`: The main HTML file that contains the structure of the application.
- \`styles.css\`: The stylesheet for styling the application.
- \`script.js\`: The JavaScript file containing the logic for handling image uploads, resizing, and downloading.
- \`assets/images/favicon.svg\`: The SVG favicon for the application.
- \`assets/images/favicon.png\`: The PNG favicon for the application.

## Dependencies

The project uses the following external libraries:

- [Font Awesome](https://cdnjs.com/libraries/font-awesome): For icons used in the UI.
- [JSZip](https://cdnjs.com/libraries/jszip): For generating ZIP archives of the resized images.

## Customization

You can customize the look and feel of the Canvas Resizer Tool by modifying the \`styles.css\` file. Additionally, you can adjust the image processing logic in \`script.js\` to suit your specific needs.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch with your feature or bugfix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Special thanks to the open-source community for providing the tools and libraries that made this project possible.
