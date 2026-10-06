import { useRef, useState } from 'react';
import { ConceptSection } from '../../components/ConceptSection';
import { DebugInsight } from '../../components/DebugInsight';
import { Explanation } from '../../components/Explanation';
import { FlowSteps } from '../../components/FlowSteps';
import { PlaygroundCard } from '../../components/PlaygroundCard';
import { StatGrid } from '../../components/StatGrid';
import { VerificationCard } from '../../components/VerificationCard';

type Item = {
  id: string;
  name: string;
  initialLikes: number;
};

type KeyStrategy = 'id' | 'index';

const INITIAL_ITEMS: Item[] = [
  { id: 'item-1', name: 'Alpha', initialLikes: 12 },
  { id: 'item-2', name: 'Bravo', initialLikes: 34 },
  { id: 'item-3', name: 'Charlie', initialLikes: 56 },
];

type ListRowProps = {
  item: Item;
  position: number;
  strategy: KeyStrategy;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
};

function ListRow({ item, position, strategy, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDelete }: ListRowProps) {
  const [likes, setLikes] = useState(item.initialLikes);
  const [userClicked, setUserClicked] = useState(false);
  const keyText = strategy === 'id' ? item.id : String(position);
  const stateMismatch = !userClicked && likes !== item.initialLikes;

  return (
    <div className="child-card" style={{ gap: '0.625rem' }}>
      <div className="btn-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="btn-row" style={{ alignItems: 'center', gap: '0.375rem' }}>
          <span className="badge badge-accent">{item.name}</span>
          <span className="badge">key = {keyText}</span>
          <span className="badge">position {position}</span>
        </div>
        <div className="btn-row" style={{ gap: '0.375rem' }}>
          <button type="button" className="btn" onClick={onMoveUp} disabled={!canMoveUp} aria-label={`Move ${item.name} up`}>
            Up
          </button>
          <button
            type="button"
            className="btn"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label={`Move ${item.name} down`}
          >
            Down
          </button>
          <button type="button" className="btn" onClick={onDelete} aria-label={`Delete ${item.name}`}>
            Delete
          </button>
        </div>
      </div>
      <div className="btn-row" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setLikes((value) => value + 1);
            setUserClicked(true);
          }}
        >
          Like this row ({likes})
        </button>
        <span className="badge">row started with {item.initialLikes} likes</span>
        {stateMismatch ? <span className="badge badge-warn">state followed position, not the item</span> : null}
      </div>
    </div>
  );
}

function ListPlayground() {
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [strategy, setStrategy] = useState<KeyStrategy>('id');
  const [listVersion, setListVersion] = useState(0);
  const nextNumberRef = useRef(4);

  const addItem = () => {
    const number = nextNumberRef.current;
    nextNumberRef.current += 1;
    setItems((prev) => [
      ...prev,
      { id: `item-${number}`, name: `Item ${String.fromCharCode(64 + number)}`, initialLikes: number * 7 },
    ]);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) {
        return prev;
      }
      const next = [...prev];
      const moved = next[index];
      next[index] = next[target];
      next[target] = moved;
      return next;
    });
  };

  const deleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, position) => position !== index));
  };

  const reset = () => {
    nextNumberRef.current = 4;
    setListVersion((version) => version + 1);
    setItems(INITIAL_ITEMS);
  };

  return (
    <div className="playground-body">
      <FlowSteps steps={['Data Identity', 'Array Position', 'Keys Tell React Which Is Which']} />

      <div className="panel">
        <h4>Key strategy</h4>
        <div className="segmented" role="group" aria-label="Key strategy">
          <button type="button" aria-pressed={strategy === 'id'} onClick={() => setStrategy('id')}>
            Stable ID keys
          </button>
          <button type="button" aria-pressed={strategy === 'index'} onClick={() => setStrategy('index')}>
            Array index keys
          </button>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={addItem}>
            Add item
          </button>
          <button type="button" className="btn" onClick={reset}>
            Reset list
          </button>
        </div>
        <StatGrid
          items={[
            { label: 'Items', value: `${items.length}`, accent: true },
            { label: 'Key strategy', value: strategy === 'id' ? 'stable id' : 'array index' },
            { label: 'Identity rule', value: 'Data ≠ Position' },
          ]}
        />
      </div>

      <div className="panel">
        <h4>Items</h4>
        <div className="plain-list">
          {items.map((item, index) => (
            <ListRow
              key={`${listVersion}:${strategy === 'id' ? item.id : index}`}
              item={item}
              position={index}
              strategy={strategy}
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
              onMoveUp={() => moveItem(index, -1)}
              onMoveDown={() => moveItem(index, 1)}
              onDelete={() => deleteItem(index)}
            />
          ))}
          {items.length === 0 ? <p className="note-box">The list is empty — add an item.</p> : null}
        </div>
        {strategy === 'index' ? (
          <div className="warning-box">
            <span className="warning-title">Index keys: React identifies rows by position (0, 1, 2…)</span>
            <span className="warning-body">
              Delete a middle row or reorder the list, then look at the like counts. Component state follows the
              position, so it can attach to the wrong item. The “state followed position” badge marks the rows where
              it happened.
            </span>
          </div>
        ) : (
          <p className="note-box ok">
            Stable IDs: every row keeps its own identity and its own state, no matter where it moves or what is
            removed around it.
          </p>
        )}
      </div>
    </div>
  );
}

export function ListModule() {
  return (
    <ConceptSection id="lists-keys">
      <Explanation
        what="map() produces an array of elements. A key on each element lets React match elements between renders instead of guessing by position."
        why="Without stable keys, React confuses items when the list changes — and local state inside rows can end up attached to the wrong item."
      />
      <PlaygroundCard
        title="List Identity Playground"
        hint="Add, delete, and reorder rows with each key strategy. Watch the per-row like state to see identity in action."
      >
        <ListPlayground />
      </PlaygroundCard>
      <VerificationCard
        questions={[
          {
            prompt: 'An item in the middle of the list is deleted. Which key strategy best preserves item identity?',
            options: [
              'Stable IDs generated from the item data',
              'The array index (0, 1, 2…)',
              'No keys at all',
              'A new random key on every render',
            ],
            correctIndex: 0,
            explanation:
              'Stable IDs travel with the item, so React still recognises it after deletes and reorders. Index keys describe position, not identity, and random keys force React to throw away all state every render.',
          },
          {
            prompt: 'What does a key actually tell React?',
            options: [
              'Which item is which when the list changes between renders',
              'The order in which to display items',
              'The CSS class to apply to the element',
              'That the element is immutable',
            ],
            correctIndex: 0,
            explanation:
              'Keys are identity, not styling or ordering. The array controls order; the key tells React which element from the previous render corresponds to which element now.',
          },
        ]}
      />
      <DebugInsight
        items={[
          'Does every item have stable identity?',
          'Is the key based on identity or position?',
          'Do keys stay the same across renders for the same item?',
          'Does any component state inside a row depend on its position?',
        ]}
      />
    </ConceptSection>
  );
}
