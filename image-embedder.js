import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class ImageEmbedderController extends Controller {
  @tracked imageUrl = "";
  @tracked altText = "";

  @action
  insertImage() {
    const description = this.altText || "image";
    const markdown = `![${description}](${this.imageUrl})`;
    
    // This model was passed from the 'show' call in the initializer
    this.model.toolbarEvent.addText(markdown);
    this.closeModal();
  }
}
