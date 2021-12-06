import {compile} from 'handlebars';
import {DateTime} from 'luxon';
import {FunctionalComponent, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import Select, {StylesConfig} from 'react-select';
import {charges} from './charges';

const DEFAULT_TEMPLATE = `
Undersheriff M. Rhodes has hereby cited {{fullName}} with the following charges:
{{#each charges}}
    \u2022 {{label}}
{{/each}}

This citation amounts to a \${{fine}} fine and {{points}} points on your driving license

Please note that signing this citation is not an admission of guilt, and that you have 60 days to contest these charges.

320 Undersheriff M. Rhodes
{{dateTime}}`;

const options = charges.map(({charge, fine}, index) => ({
  value: index,
  label: `${charge} ($${fine})`,
}));
const customStyles: StylesConfig = {
  container: () => ({
    backgroundColor: '#303337',
    color: '#D3D4D5',
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #47494D',
    backgroundColor: '#303337',
    color: '#D3D4D5', // state.isSelected ? "red" : "#D3D4D5",
    padding: 20,
  }),
  control: () => ({
    width: 200,
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: '#D3D4D5',
  }),
};

const numberFormat = new Intl.NumberFormat('en-US');

const Home: FunctionalComponent = () => {
  const [fullName, setFullName] = useState<string>('');
  const [fine, setFine] = useState<string>('');
  const [points, setPoints] = useState<string>('');
  const [charges, setCharges] = useState<string[]>([]);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE.trim());
  console.log(charges);
  const result = useMemo(
    () =>
      compile(template.trim())({
        fullName,
        fine: fine ? numberFormat.format(Number(fine)) : '',
        points,
        charges,
        dateTime: DateTime.now()
          .setLocale('en-US')
          .setZone('America/New_York')
          .toFormat(`DDDD 'at' tt ZZZZ`),
      }),
    [template, fullName, fine, points, charges],
  );

  const reset = (): void => {
    setFullName('');
    setFine('');
    setPoints('');
    setCharges([]);
    setTemplate(DEFAULT_TEMPLATE.trim());
  };

  return (
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm">
            <h2 class="content-title">Citation generator</h2>
          </div>
          <div class="col-sm" style={{textAlign: 'right'}}>
            <button class="btn" type="button" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <form>
        <div class="form-row row-eq-spacing-sm">
          <div class="col-sm">
            <label for="full-name" class="required">
              Criminal scum name
            </label>
            <input
              type="text"
              class="form-control"
              id="full-name"
              placeholder="Bryan Barker"
              autofocus
              required
              value={fullName}
              onInput={({target}): void =>
                setFullName((target as HTMLInputElement).value)
              }
            />
          </div>
          <div class="col-sm">
            <label for="fine" class="required">
              Fine
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">$</span>
              </div>
              <input
                type="number"
                class="form-control"
                placeholder="0"
                id="fine"
                required
                min={0}
                value={fine}
                onInput={({target}): void =>
                  setFine((target as HTMLInputElement).value)
                }
              />
            </div>
          </div>
          <div class="col-sm">
            <label for="points" class="required">
              Points
            </label>
            <input
              type="number"
              class="form-control"
              placeholder="0"
              id="points"
              value={points}
              onInput={({target}): void =>
                setPoints((target as HTMLInputElement).value)
              }
            />
          </div>
        </div>
        <div class="form-row row-eq-spacing-sm">
          <div class="col-sm">
            <label for="charges" class="required">
              Charges
            </label>
            <Select
              options={options}
              styles={customStyles}
              tabSelectsValue
              isMulti={true}
              value={charges}
              onChange={(value): void =>
                setCharges(Array.isArray(value) ? value : [])
              }
            />
          </div>
        </div>
        <div class="form-row row-eq-spacing-sm">
          <div class="col-sm">
            <label for="result" class="required">
              Citation
            </label>
            <textarea
              id="result"
              class="form-control"
              placeholder="Template"
              style={{minHeight: '25rem'}}
              readonly
            >
              {result}
            </textarea>
          </div>
        </div>
        <details class="collapse-panel">
          <summary class="collapse-header">Advanced</summary>
          <div class="collapse-content">
            <div class="form-row row-eq-spacing-sm">
              <label for="template" class="required">
                Template
              </label>
              <textarea
                id="template"
                class="form-control"
                placeholder="Template"
                style={{minHeight: '25rem'}}
                onInput={({target}): void =>
                  setTemplate((target as HTMLTextAreaElement).value)
                }
              >
                {template}
              </textarea>
            </div>
          </div>
        </details>
      </form>
    </div>
  );
};

export default Home;
