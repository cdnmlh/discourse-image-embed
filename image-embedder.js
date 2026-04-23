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
