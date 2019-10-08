import ItemsRowComponent from './GanttItemsRow';
export default function GnattItems(core) {
  const { api, state, onDestroy, action, update, html, createComponent, repeat } = core;
  const componentName = 'chart-gantt-items';
  const componentAction = api.getAction(componentName);
  let className;
  onDestroy(
    state.subscribe('config.classNames', () => {
      className = api.getClass(componentName);
      update();
    })
  );

  let rows = [],
    rowsComponents = [];
  onDestroy(
    state.subscribe('_internal.list.visibleRows;', visibleRows => {
      rows = visibleRows;
      rowsComponents.forEach(row => row.component.destroy());
      rowsComponents = [];
      for (const row of rows) {
        rowsComponents.push({ id: row.id, component: createComponent(ItemsRowComponent, { rowId: row.id }) });
      }
      update();
    })
  );

  onDestroy(() => {
    rowsComponents.forEach(row => row.component.destroy());
  });

  return props => html`
    <div class=${className} data-action=${action(componentAction, { api, state })}>
      ${rowsComponents.map(r => r.component.html())}
    </div>
  `;
}
