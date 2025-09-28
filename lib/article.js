// lib/article.js
import { getResponseFromPerplexity } from './pplx';

class Query {
  constructor(query, parent = null, breadth = 0, depth = 0) {
    this.query = query;
    this.parent = parent;
    this.breadth = breadth;
    this.depth = depth;
    this.children = [];
    this.response = '';
  }

  getHistory() {
    const history = [{ role: 'user', content: this.query }];
    let ptr = this.parent;
    while (ptr != null) {
      history.push({ role: 'assistant', content: ptr.response });
      history.push({ role: 'user', content: ptr.query });
      ptr = ptr.parent;
    }
    history.push({
      role: 'system',
      content:
        "Only provide the information that is asked, don't start with an introduction and don't end the response with a summary. Skip the introduction and summary.",
    });
    return history.reverse();
  }

  async fill() {
    const history = this.getHistory();
    const { content, related } = await getResponseFromPerplexity(history);
    this.response = content || '';
    if (this.depth > 0) {
      const next = related.slice(0, this.breadth);
      for (const q of next) {
        const child = new Query(q, this, this.breadth, this.depth - 1);
        this.children.push(child);
      }
    }
  }
}

export class Article {
  constructor(query, breadth = 2, depth = 3) {
    this.root = new Query(query, null, breadth, depth);
  }

  async generate() {
    // Level-order traversal; siblings can be parallelized per level if needed
    let queue = [this.root];
    while (queue.length) {
      // Process a level in parallel for efficiency
      await Promise.all(queue.map((node) => node.fill()));
      // Collect next level
      const next = [];
      for (const node of queue) {
        for (const child of node.children) next.push(child);
      }
      queue = next;
    }
  }

  toMarkdown() {
    let out = '';
    const createDoc = (node, level = 1, prefix = '') => {
      const numbering = prefix + (level > 1 ? '. ' : '');
      out += `# ${numbering}${node.query}\n`;
      out += `${node.response}\n`;
      node.children.forEach((child, i) =>
        createDoc(child, level + 1, prefix + (level > 1 ? '.' : '') + `${i + 1}`)
      );
    };
    createDoc(this.root);
    return out;
  }
}
