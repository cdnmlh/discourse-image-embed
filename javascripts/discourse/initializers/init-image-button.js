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
          title: "Embed Image URL",
          perform: (toolbarEvent) => {
            // This is the key: we call the service, we don't just "show" HTML
            modal.show("image-embedder", {
              model: { toolbarEvent }
            });
          },
        });
      });
    });
  },
};
