// frontend/src/extensions/extensionLoader.ts
import { ExtensionModule, ExtensionContext } from "./extensionAPI";

const loadedExtensions: Record<string, ExtensionModule> = {};

export function loadExtension(ext: ExtensionModule, ctx: ExtensionContext) {
  if (loadedExtensions[ext.id]) {
    console.warn(`Extension ${ext.id} already loaded`);
    return;
  }

  // Ask for permissions explicitly
  if (ext.permissions && ext.permissions.length > 0) {
    ext.permissions.forEach(async (perm) => {
      const granted = await ctx.requestPermission(perm);
      if (!granted) {
        console.warn(`Permission "${perm}" denied for extension ${ext.id}`);
      }
    });
  }

  try {
    ext.activate(ctx);
    loadedExtensions[ext.id] = ext;
    console.log(`Extension loaded: ${ext.id}`);
  } catch (err) {
    console.error(`Error activating extension ${ext.id}:`, err);
  }
}

export function unloadExtension(id: string) {
  const ext = loadedExtensions[id];
  if (!ext) return;

  try {
    ext.deactivate?.();
    delete loadedExtensions[id];
    console.log(`Extension unloaded: ${id}`);
  } catch (err) {
    console.error(`Error deactivating extension ${id}:`, err);
  }
}

export function listExtensions(): ExtensionModule[] {
  return Object.values(loadedExtensions);
      }
