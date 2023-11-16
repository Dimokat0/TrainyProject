import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getAllPosts() {
    return this.postRepository.getAllPosts();
  }

  createPost(name: string, caption: string, access_token: string) {
    return this.postRepository.createPost(name, caption, access_token);
  }

  updatePost(id: number, name?: string, caption?: string) {
    return this.postRepository.updatePost(id, name, caption);
  }

  deletePost(id: number) {
    return this.postRepository.deletePost(id);
  }
}
