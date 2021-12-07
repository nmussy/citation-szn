import {compile} from 'handlebars';
import {DateTime} from 'luxon';
import {FunctionalComponent, h} from 'preact';
import {useMemo, useState} from 'preact/hooks';
import Select, {StylesConfig} from 'react-select';
import {charges} from './charges';

const DEFAULT_TEMPLATE = `
{{rank}} {{officerName}} of the {{department}} has hereby cited {{fullName}} with the following charges:
{{#each charges}}
    \u2022 {{label}}
{{/each}}

This citation amounts to a \${{fine}} fine and {{points}} points on your driver's license

Please note that signing this citation is not an admission of guilt, and that you have 60 days to contest these charges.

{{callsign}} {{rank}} {{officerName}}
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
    display: 'flex',
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
  const [department, setDepartment] = useState(
    localStorage.department ?? 'The Bay',
  );
  const [officerName, setOfficerName] = useState(
    localStorage.officerName ?? 'Matt Rhodes',
  );
  const [rank, setRank] = useState(localStorage.rank ?? 'Undersheriff');
  const [callsign, setCallsign] = useState(localStorage.callsign ?? '320');
  const [template, setTemplate] = useState(
    localStorage.template ?? DEFAULT_TEMPLATE.trim(),
  );
  const result = useMemo(
    () =>
      compile(template.trim())({
        fullName,
        fine: fine ? numberFormat.format(Number(fine)) : '',
        points,
        charges,
        department,
        officerName,
        rank,
        callsign,
        dateTime: DateTime.now()
          .setLocale('en-US')
          .setZone('America/New_York')
          .toFormat(`DDDD 'at' tt ZZZZ`),
      }),
    [
      template,
      fullName,
      fine,
      points,
      charges,
      callsign,
      department,
      officerName,
      rank,
    ],
  );

  const save = (): void => {
    localStorage.department = department;
    localStorage.officerName = officerName;
    localStorage.rank = rank;
    localStorage.callsign = callsign;
    localStorage.template = template;
  };

  const reset = (): void => {
    setFullName('');
    setFine('');
    setPoints('');
    setCharges([]);
    setDepartment(localStorage.department ?? 'The Bay');
    setOfficerName(localStorage.officerName ?? 'Matt Rhodes');
    setRank(localStorage.rank ?? 'Undersheriff');
    setCallsign(localStorage.callsign ?? '320');
    setTemplate(localStorage.template ?? DEFAULT_TEMPLATE.trim());
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
            <label for="full-name">Criminal scum name</label>
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
            <label for="fine">Fine</label>
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
            <label for="points">Points</label>
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
            <label for="charges">Charges</label>
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
            <label for="result">Citation</label>
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
          <summary class="collapse-header">Configuration</summary>
          <div class="collapse-content">
            <div class="form-row row-eq-spacing-sm">
              <div class="col-sm">
                <label for="officerName">Officer name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="0"
                  id="officerName"
                  value={officerName}
                  onInput={({target}): void =>
                    setOfficerName((target as HTMLInputElement).value)
                  }
                />
              </div>
              <div class="col-sm">
                <label for="department">Department</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="BCSO > LSPD"
                  id="department"
                  value={department}
                  onInput={({target}): void =>
                    setDepartment((target as HTMLInputElement).value)
                  }
                />
              </div>
              <div class="col-sm">
                <label for="rank">Rank</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Under the Undersheriff"
                  id="rank"
                  value={rank}
                  onInput={({target}): void =>
                    setRank((target as HTMLInputElement).value)
                  }
                />
              </div>
              <div class="col-sm">
                <label for="callsign">Callsign</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="220"
                  id="callsign"
                  value={callsign}
                  onInput={({target}): void =>
                    setCallsign((target as HTMLInputElement).value)
                  }
                />
              </div>
            </div>
            <div class="form-row row-eq-spacing-sm">
              <label for="template">Citation template</label>
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
            <div style={{textAlign: 'right'}}>
              <button class="btn btn-success" type="button" onClick={save}>
                Save configuration
              </button>
            </div>
          </div>
        </details>
      </form>
    </div>
  );
};

export default Home;
