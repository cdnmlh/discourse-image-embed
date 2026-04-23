Setting up a modal in Discourse is a two-part job. You need the template (the HTML/Handlebars) and the logic (the Javascript) to handle the data.

Since you are likely working within a Theme Component, here is the implementation using the modern Glimmer-style approach.

1. The Modal Template
In your theme component, create a new template under javascripts/discourse/templates/modal/image-embedder.hbs.

Handlebars
<DModal 
  @title="Embed an Image" 
  @closeModal={{@closeModal}}
  class="image-embedder-modal"
>
  <:body>
    <div class="control-group">
      <label for="image-url">Image URL</label>
      <Input 
        @type="text" 
        @value={{this.imageUrl}} 
        id="image-url" 
        placeholder="https://example.com/image.png"
        autofocus="autofocus"
      />
    </div>
    <div class="control-group">
      <label for="image-alt">Alt Text (Optional)</label>
      <Input 
        @type="text" 
        @value={{this.altText}} 
        id="image-alt" 
        placeholder="Description of the image"
      />
    </div>
  </:body>

  <:footer>
    <DButton 
      @label="Insert Image" 
      @action={{this.insertImage}} 
      @icon="plus" 
      class="btn-primary" 
      @disabled={{this.isInvalid}}
    />
    <DButton 
      @label="Cancel" 
      @action={{@closeModal}} 
      class="btn-flat" 
    />
  </:footer>
</DModal>
2. The Modal Logic
Create the backing class in javascripts/discourse/controllers/image-embedder.js. This handles the button click and calculates the Markdown.

JavaScript
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class ImageEmbedderController extends Controller {
  @tracked imageUrl = "";
  @tracked altText = "";

  get isInvalid() {
    return !this.imageUrl.startsWith("http");
  }

  @action
  insertImage() {
    const description = this.altText || "image";
    const markdown = `![${description}](${this.imageUrl})`;
    
    // Send the markdown back to the composer
    this.model.toolbarEvent.addText(markdown);
    
    // Close the modal
    this.closeModal();
  }
}
3. The Toolbar Button
Finally, you need to tell Discourse to open this specific modal when the button is clicked. Add this to your javascripts/discourse/initializers/init-image-button.js:

JavaScript
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "image-embedder-init",
  initialize() {
    withPluginApi("0.8.31", (api) => {
      const modal = api.container.lookup("service:modal");

      api.onToolbarCreate((toolbar) => {
        toolbar.addButton({
          id: "open_image_modal",
          group: "insertions",
          icon: "image",
          title: "Embed Custom Image URL",
          perform: (toolbarEvent) => {
            // This triggers the modal and passes the toolbar context
            modal.show("image-embedder", {
              model: { toolbarEvent }
            });
          },
        });
      });
    });
  },
};
