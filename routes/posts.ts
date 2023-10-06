import express from 'express';
import sequelizedb from '../sequelizedb';
import { authenticate, authorize } from '../authMiddleware'

const router = express.Router();

router.get('/posts', async (req: express.Request, res: express.Response) => {
    const postsList = await sequelizedb.models.posts.findAll({
        include: [{
            model: sequelizedb.models.users,
            as: 'author'
        }]
    });
    res.json(postsList);
});

router.get('/getUserType', authenticate, authorize(["administrator", "superAdmin"]), (req: express.Request, res: express.Response) => {
    res.send("administrator");
});

// should be replaced somewhere, dk where rn (repository logic)
async function updatePost(id: number, name?: string, caption?: string): Promise<void> {
    const updateData: { name?: string; caption?: string} = {};
    if (name) {
      updateData.name = name;
    }
    if (caption) {
      updateData.caption = caption;
    }
    await sequelizedb.models.posts.update(updateData, { where: { id } });
}

async function createPost(name: string, caption: string, authorId: string): Promise<void> {
    await sequelizedb.models.posts.create({
        name,
        caption,
        date: new Date(),
        authorId
    });
  }

async function deletePost(id: number): Promise<void> {
    await sequelizedb.models.posts.destroy({ where: { id } });
}
////

// controller logic
router.patch('/updatePost/:id', authenticate, authorize(["administrator", "superAdmin"]), async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { name, caption } = req.body;
    try{
        await updatePost(parseInt(id), name, caption);
        res.send('Post updated');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occured while updating the post.' })
    }
  });

router.post('/createPost', authenticate, async (req: express.Request, res: express.Response) => {
    const { name, caption, authorId } = req.body;
    try {
        await createPost(name, caption, authorId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the post.' });
    }
});

router.delete('/deletePost', authenticate, authorize(["administrator", "superAdmin"]), async (req: express.Request, res: express.Response) => {
    const { id } = req.body;
    try{
        await deletePost(id);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while deleting the post.' })
    }
});

export default router;