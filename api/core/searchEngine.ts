type InvertedIndex = {
  [word: string]: {
    [docId: number]: number;
  };
};

type Documents = {
  [docId: number]: string;
};

class SearchEngine
{
  private readonly invertedIndex: InvertedIndex;
  private readonly documents: Documents;

  constructor()
  {
    this.invertedIndex = {};
    this.documents = {};
  }

  private normalize(text: string): string
  {
    return text.toLowerCase().replaceAll(/[^\w\s]/g, "");
  }

  private tokenize(text: string): string[]
  {
    return text.split(/\s+/).filter(Boolean);
  }

  addDocument(docId: number, text: string): void
  {
    const normalized = this.normalize(text);
    const tokens = this.tokenize(normalized);
    const freqMap: { [word: string]: number } = {};
    for (const word of tokens)
    {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }
    for (const word in freqMap)
    {
      this.invertedIndex[word] ??= {};
      this.invertedIndex[word][docId] = freqMap[word] || 0;
    }

    this.documents[docId] = text;
  }

  search(query: string): number[]
  {
    const normalized = this.normalize(query);
    const tokens = this.tokenize(normalized);

    if (tokens.length === 0)
    {
      return [];
    }

    let candidateDocs: Set<number> | null = null;

    for (const word of tokens)
    {
      const postings = this.invertedIndex[word];

      if (!postings)
      {
        return [];
      }

      const docIds = new Set(Object.keys(postings).map(Number));

      if (candidateDocs === null)
      {
        candidateDocs = docIds;
      }
      else
      {
        candidateDocs = new Set(
          Array.from<number>(candidateDocs).filter(id => docIds.has(id))
        );
      }
    }

    if (!candidateDocs)
    {
      return [];
    }
    const scores: { [docId: number]: number } = {};
    for (const docId of candidateDocs)
    {
      scores[docId] = 0;
      for (const word of tokens)
      {
        scores[docId] += this.invertedIndex[word]?.[docId] || 0;
      }
    }
    return Object.keys(scores)
      .map(Number)
      .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  }
  getState()
  {
    return {
      invertedIndex: this.invertedIndex,
      documents: this.documents
    };
  }
}
export default SearchEngine;