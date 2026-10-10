import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ApplyBlock from './ApplyBlock';
import { isTypeformId, typeformUrl } from '../lib/typeform';
import { PAGES } from '../lib/pages';

const apply = PAGES.riders.apply!;

describe('typeform helpers', () => {
  it.each(['abc1', 'Xy7Kq2Lm'])('accepts the form id %s', (id) => expect(isTypeformId(id)).toBe(true));
  it.each([undefined, '', 'ab', 'abc/../x', 'abc?x=1', 'a b c d', 'javascript:x'])('rejects %j', (id) =>
    expect(isTypeformId(id)).toBe(false));
  it('builds the embed URL', () => expect(typeformUrl('Xy7Kq2Lm')).toBe('https://form.typeform.com/to/Xy7Kq2Lm?typeform-medium=embed-snippet'));
});

describe('ApplyBlock', () => {
  afterEach(cleanup);

  it('embeds the Typeform when a valid form id is configured', () => {
    render(<ApplyBlock apply={apply} formId="Xy7Kq2Lm" />);
    const frame = screen.getByTitle(apply.heading);
    expect(frame.getAttribute('src')).toBe(typeformUrl('Xy7Kq2Lm'));
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it.each([undefined, 'bad/id'])('shows the readiness check without a valid form id (%j)', (formId) => {
    render(<ApplyBlock apply={apply} formId={formId} />);
    expect(document.querySelector('iframe')).toBeNull();
    expect(screen.getAllByRole('checkbox')).toHaveLength(apply.checklist.length);
    expect(screen.getByText(/nothing is saved or sent/)).toBeTruthy();
  });

  it('counts ticked items and confirms when everything is ready', () => {
    render(<ApplyBlock apply={apply} />);
    const boxes = screen.getAllByRole('checkbox');
    expect(screen.getByRole('status').textContent).toBe(`0 of ${boxes.length} ready`);
    fireEvent.click(boxes[0]);
    expect(screen.getByRole('status').textContent).toBe(`1 of ${boxes.length} ready`);
    boxes.slice(1).forEach((b) => fireEvent.click(b));
    expect(screen.getByRole('status').textContent).toMatch(/You have everything verification asks for/);
  });
});
