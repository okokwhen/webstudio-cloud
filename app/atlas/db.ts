import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.POCKETBASE_URL!);

pb.authStore.save(process.env.POCKETBASE_ADMIN_TOKEN!, null);

export { pb };