declare module 'relationship.js' {
  interface RelationshipOptions {
    text: string
    reverse?: boolean
    type?: 'default' | 'chain'
    sex?: 0 | 1  // 0 = female, 1 = male
  }

  export default function relationship(options: RelationshipOptions): string[]
}
