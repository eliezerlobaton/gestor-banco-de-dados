function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  if (
    window.Blob == undefined ||
    window.URL == undefined ||
    window.URL.createObjectURL == undefined
  ) {
    alert("Your browser doesn't support Blobs");
    return;
  }

  csvFile = new Blob([csv], { type: 'text/csv' });
  downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

const htmlElementTypeEnum = Object.freeze({
  TABLE: 'TABLE',
});

const collectTableData = (table) => {
  if (!table.nodeName === htmlElementTypeEnum.TABLE)
    throw new TypeError('the select passed dont belong to a table');
  return Object.values(table.querySelectorAll('tr'))
    .map((tr) => {
      // const row = Object.values(tr.children).reduce((str, child) => {
      //   return (str !== '' && str !== '\n' ? str.concat(',') : str).concat(
      //     child.innerText,
      //   );
      // }, '');
      console.log(Object.values(tr.children));
      const row = Object.values(tr.children)
        .map((child) => child.innerText.replace(/[\r\n]+/g, '; ') || ' ')
        .join(',');
      console.log(row);
      return row;
    })
    .join('\n');
};

const exportTableToCSV = (tableSelector, fileName) => {
  const element = document.querySelector(tableSelector);
  const data = collectTableData(element);
  return downloadCSV(data, fileName);
};

const createProductTag = (product, category) => {
  const tag = document.createElement('li');
  tag.setAttribute('data-id', product.id);
  tag.innerHTML = `<div class="tag"><span>${product.nome}</span><button type="button" class="tag-delete-button" onclick=removeProductInCategory(${category.id},${product.id})>x</button></div>`;
  return tag;
};

const resetSelectCategoryInput = (categoryId, productId, disabled) => {
  document.querySelector(`#select-${categoryId}`).value = '';

  const categoryOption = document.querySelector(
    `#select-${categoryId} option[value="${productId}"]`,
  );

  if (disabled) categoryOption.setAttribute('disabled', '');
  else categoryOption.removeAttribute('disabled');

  document
    .querySelector(`#select-${categoryId} option[value=""]`)
    .setAttribute('selected', '');
};

const addProductToCategory = async (categoryId) => {
  const url = `/category/${categoryId}`;
  const category = await (await fetch(url)).json();
  const productId = document.querySelector(`#select-${categoryId}`).value;
  resetSelectCategoryInput(categoryId, productId, true);
  const found = document.querySelector(
    `#category-${categoryId} .content ul li[data-id="${productId}"]`,
  );
  if (!found) {
    const response = await (
      await fetch(url, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: category.name,
          produtoIds: [
            +productId,
            ...category.produtos.map((produto) => produto.id),
          ],
        }),
      })
    ).json();
    const [produto] = response.produtos.filter(
      (produto) => produto.id === +productId,
    );
    document
      .querySelector(`#category-${categoryId} .content ul`)
      .appendChild(createProductTag(produto, category));
    return produto;
  }
  return productId;
};

const removeProductInCategory = async (categoryId, productId) => {
  const url = `/category/${categoryId}/product/${productId}`;
  const response = await (
    await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json();
  document
    .querySelector(`#category-${categoryId} li[data-id="${productId}"]`)
    .remove();
  resetSelectCategoryInput(categoryId, productId, false);
  return response;
};

const removeCategory = async (categoryId) => {
  const url = `/category/${categoryId}`;
  const response = await (
    await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json();
  document.querySelector(`#category-${categoryId}`).remove();
  return response;
};

const createCategoryTag = (category, products) => {
  const categoryElement = document.createElement('div');
  categoryElement.setAttribute('id', `category-${category.id}`);
  categoryElement.setAttribute('class', 'list-item');
  categoryElement.innerHTML = `
  <div class="list-item-card">
  <section class="collapsible" onclick=turnCollapsibleOn(this)>
    <h4 class="highlighted-border">${category.name}</h4>
    <div>
      <strong>
        +
      </strong>
    </div>
  </section>
  <div class="content">
    <div class="input-select">
      <select id="select-${category.id}">
        <option value="" selected disabled>Produtos</option>
        ${products
          .map(
            (item) =>
              '<option value="' + item.id + '">' + item.nome + '</option>',
          )
          .join('\n')} 
      </select>
      <button type="submit" onclick=addProductToCategory(${
        category.id
      })> <strong>
          +
        </strong></button>
    </div>
    <ul>
    </ul>
  </div>
</div>
<button type="button" class="delete-button" onclick=removeCategory(${
    category.id
  })>
  x
</button>
  `;
  return categoryElement;
};

const getProducts = async () => {
  const url = `/produtos`;
  const response = await (
    await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  ).json();
  return response.data;
};

const createCategory = async (products) => {
  const categoryName = document.querySelector('#category-name').value;
  const url = `/category`;
  const response = await (
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: categoryName,
        produtoIds: [],
      }),
    })
  ).json();
  const list = document.querySelector('.list');
  list.insertBefore(
    createCategoryTag(response, await getProducts()),
    list.childNodes[0],
  );
  document.querySelector('#category-name').value = '';
  return response;
};
