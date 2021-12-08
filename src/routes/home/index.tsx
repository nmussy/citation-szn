import {compile} from 'handlebars';
import {DateTime} from 'luxon';
import {FunctionalComponent, h} from 'preact';
import {useContext, useMemo, useState} from 'preact/hooks';
import TextareaAutosize from 'react-autosize-textarea';
import Select, {StylesConfig} from 'react-select';
import {Theme} from '../../components/Theme';
import {charges} from './charges';
import './home.css';

const DEFAULT_TEMPLATE = `
{{rank}} {{officerName}} of the {{department}} has hereby cited {{fullName}} with the following charges:
{{#each charges}}
    \u2022 {{label}}
{{/each}}

This citation amounts to a \${{fine}} fine{{#if points}} and {{points}} points on their driver's license{{/if}}.

Please note that signing this citation is not an admission of guilt, and that you have 60 days to contest these charges.

{{callsign}} {{rank}} {{officerName}}
{{dateTime}}`;

type Option = {value: string; label: string};
const getOptions = (exitingOptions: Option[] = []): Option[] =>
  [
    ...charges.map(({charge}, index) => ({
      value: String.fromCharCode(index + 65),
      label: charge,
    })),
    ...exitingOptions.map(({value, label}) => ({value: value + 1, label})),
  ].sort((a, b) => a.value.localeCompare(b.value));

const customStyles: StylesConfig = {
  menuList: (provided) => ({
    ...provided,
    backgroundColor: '#303337',
  }),
  noOptionsMessage: () => ({
    textAlign: 'center',
    backgroundColor: '#303337',
    color: '#D3D4D5',
  }),
  container: () => ({
    backgroundColor: '#303337',
    color: '#D3D4D5',
  }),
  input: (provided) => ({
    ...provided,
    color: '#D3D4D5',
  }),
  option: (provided, state) => ({
    ...provided,
    ':active': {
      backgroundColor: '#232323',
    },
    borderBottom: '1px solid #47494D',
    backgroundColor: state.isFocused ? '#222426' : '#303337',
    color: '#D3D4D5',
    padding: 5,
  }),
  control: () => ({
    display: 'flex',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#D3D4D5',
  }),
};

const numberFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
});

const Home: FunctionalComponent = () => {
  const theme = useContext(Theme);

  const [fullName, setFullName] = useState<string>('');
  const [fine, setFine] = useState<string>('');
  const [points, setPoints] = useState<string>('');
  const [chargesOptions, setChargesOptions] = useState<Option[]>(getOptions());
  const [charges, setCharges] = useState<Option[]>([]);
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
  const [isMDWInvalid, setIsMDWInvalid] = useState(false);
  const [mdw, setMDW] = useState('');
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

  const parseMDW = (mdw: string): void => {
    setMDW(mdw);
    if (!mdw.trim().length) {
      setIsMDWInvalid(false);
      return;
    }

    const lines = mdw.trim().split('\n');

    let match;
    const charges = [];
    let fullName;
    // let sentence;
    let fine;
    let points;
    let endOfCharges = false;
    for (const line of lines) {
      if (line === 'Warrant for Arrest') {
        endOfCharges = true;
        continue;
      }

      if (!fullName && (match = line.match(/^([\w ]+) \(#\d+\)/))) {
        fullName = match[1];
        continue;
      } else if (fullName && !endOfCharges) {
        charges.push(line);
      } else if (
        endOfCharges &&
        (match = line.match(
          /^(\d+) months.+\/ \$([\d,.]+) fine( \/ (\d+) point)?/,
        ))
      ) {
        // sentence = match[1];
        fine = match[2];
        points = match[4];
        break;
      }
    }

    if (!fullName || !fine) {
      setIsMDWInvalid(true);
      return;
    }

    setFullName(fullName);
    setCharges(
      charges.map((charge, index) => ({value: `mdw_${index}`, label: charge})),
    );
    setFine(parseFloat(fine.replace(/,/g, '')).toString());
    setPoints(points ?? '');

    setIsMDWInvalid(false);
  };

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
    setChargesOptions(getOptions());
    setDepartment(localStorage.department ?? 'The Bay');
    setOfficerName(localStorage.officerName ?? 'Matt Rhodes');
    setRank(localStorage.rank ?? 'Undersheriff');
    setCallsign(localStorage.callsign ?? '320');
    setTemplate(localStorage.template ?? DEFAULT_TEMPLATE.trim());
    setMDW('');
    setIsMDWInvalid(false);
  };

  return (
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <h2 class="content-title">Citation generator</h2>
          </div>
          <div class="col" style={{textAlign: 'right'}}>
            <button class="btn" type="button" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <form>
        <div class="form-row row-eq-spacing-sm">
          <div class="col-sm">
            <div class={`form-group ${isMDWInvalid ? 'is-invalid' : ''}`}>
              <label for="mdw">
                MDW output{' '}
                <button
                  class="btn btn-square btn-sm"
                  data-toggle="tooltip"
                  data-title={
                    'Select, Ctrl+C the "Criminal scum" section of the report in the MDW and paste it below'
                  }
                  data-placement="right"
                  type="button"
                >
                  ?
                </button>
              </label>
              <TextareaAutosize
                id="mdw"
                className="form-control"
                placeholder={`Bryan Barker (#1130)\nJaywalking\nWiggling\nPoaching\nWarrant for Arrest\nReductions\nFinal\n50 months (+10 months parole) / $20,425.00 fine / 1 point(s)`}
                onChange={({target}): void =>
                  parseMDW((target as HTMLInputElement).value)
                }
                value={mdw}
                style={{resize: 'none'}}
              />
              <div
                class="invalid-feedback"
                style={{display: isMDWInvalid ? '' : 'none'}}
              >
                <ul>
                  <li>Unexpected MDW output</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-sm">
            <label for="result">Citation output</label>
            <TextareaAutosize
              id="result"
              className="form-control"
              placeholder="Template"
              readOnly
              value={result}
              style={{resize: 'none'}}
            />
          </div>
        </div>

        <h2 class="content-title">Manual input</h2>
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
              onChange={({target}): void =>
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
                onChange={({target}): void =>
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
              onChange={({target}): void =>
                setPoints((target as HTMLInputElement).value)
              }
            />
          </div>
        </div>
        <div class="form-row row-eq-spacing-sm">
          <div class="col-sm">
            <label for="charges">Charges</label>
            <Select
              noOptionsMessage={(): string => 'No charge found'}
              options={chargesOptions}
              styles={theme === 'light' ? {} : customStyles}
              tabSelectsValue
              isMulti={true}
              value={charges}
              placeholder="Charge names"
              onChange={(value): void => {
                const charges = Array.isArray(value) ? value : [];
                setCharges(charges);
                setChargesOptions(getOptions(charges));
              }}
            />
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
                  placeholder="Kayn Larp"
                  id="officerName"
                  value={officerName}
                  onChange={({target}): void =>
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
                  onChange={({target}): void =>
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
                  onChange={({target}): void =>
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
                  onChange={({target}): void =>
                    setCallsign((target as HTMLInputElement).value)
                  }
                />
              </div>
            </div>
            <div class="form-row row-eq-spacing-sm">
              <label for="template">Citation template</label>
              <TextareaAutosize
                id="template"
                className="form-control"
                placeholder="Template"
                onChange={({target}): void =>
                  setTemplate((target as HTMLTextAreaElement).value)
                }
                value={template}
                style={{resize: 'none'}}
              />
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
