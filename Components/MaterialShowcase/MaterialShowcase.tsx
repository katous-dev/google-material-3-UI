"use client";

import { useState } from "react";
import { AdvancedChip, Button, Card, Carousel, Checkbox, Chip, CircularProgress, DatePicker, FabMenu, Icon, IconButton, LinearProgress, LoadingIndicator, MaterialList, MaterialSlider, NavigationBar, Radio, RangeSlider, SplitButton, Switch, TextField, ThemeToggle, ToggleButton, Toolbar, Tooltip } from "@/Components/UI";
import styles from "./MaterialShowcase.module.scss";

const sections = ["Overview", "Actions", "Selection", "Inputs", "Content", "Navigation", "Feedback", "Pickers"];

function DemoBlock({ id, index, eyebrow, title, description, children }: { id: string; index: string; eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <section id={id} className={styles.section}><header><span>{index}</span><div><small>{eyebrow}</small><h2>{title}</h2><p>{description}</p></div></header><div className={styles.stage}>{children}</div></section>;
}

export function MaterialShowcase() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedChips, setSelectedChips] = useState(["Design"]);
  const [switchOn, setSwitchOn] = useState(true);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("Comfortable");
  const [nav, setNav] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [segment, setSegment] = useState("Week");
  const [favorite, setFavorite] = useState(false);
  const [inputChips, setInputChips] = useState(["React", "SCSS"]);

  const toggleChip = (chip: string) => setSelectedChips((current) => current.includes(chip) ? current.filter((item) => item !== chip) : [...current, chip]);

  return <main className={styles.page}>
    <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ""}`}>
      <a className={styles.brand} href="#overview" onClick={() => setMenuOpen(false)}><span><Icon name="sparkle" /></span><strong>Material<br />Playground</strong></a>
      <nav>{sections.map((section, index) => <a key={section} href={`#${section.toLowerCase()}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{section}</a>)}</nav>
      <div className={styles.sideBottom}><ThemeToggle /><div className={styles.sideNote}><Icon name="code" /><p>Built with reusable React components and scoped SCSS.</p></div></div>
    </aside>

    <button className={styles.menu} aria-label="Mở menu" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>

    <div className={styles.content}>
      <section id="overview" className={styles.hero}>
        <div className={styles.heroCopy}><div className={styles.pill}><span /> Material Design 3 / UI kit</div><h1>Expressive by<br /><em>design.</em></h1><p>Một thư viện component giàu cá tính, dễ tái sử dụng và chuyển động tự nhiên. Được xây dựng để khám phá, thử nghiệm và mở rộng.</p><div className={styles.heroActions}><Button icon="arrow" onClick={() => document.querySelector("#actions")?.scrollIntoView()}>Explore components</Button><Button variant="outlined" icon="code">View structure</Button></div></div>
        <div className={styles.heroVisual}><span className={styles.orbit}><i /><i /><i /></span><div className={styles.floatingCard}><small>YOUR THEME</small><strong>#5F5791</strong><div><span /><span /><span /><span /></div></div><button className={styles.fab} aria-label="Add"><Icon name="plus" /></button></div>
      </section>

      <DemoBlock id="actions" index="01" eyebrow="Actions" title="Buttons that respond" description="Clear hierarchy, generous shapes and tactile state layers make every action feel immediate.">
        <div className={styles.demoGroup}><h3>Button variants</h3><div className={styles.row}><Button icon="sparkle">Filled</Button><Button variant="tonal" icon="favorite">Tonal</Button><Button variant="outlined">Outlined</Button><Button variant="text">Text</Button><Button disabled>Disabled</Button></div></div>
        <div className={styles.demoGroup}><h3>Floating action buttons</h3><div className={styles.fabRow}><button className={styles.smallFab}><Icon name="plus" /></button><button className={styles.largeFab}><Icon name="palette" /></button><button className={styles.extendedFab}><Icon name="plus" /> Create new</button></div></div>
        <div className={styles.actionGrid}><div><h3>Split & toggle buttons</h3><div className={styles.row}><SplitButton label="Create" icon={<Icon name="sparkle" />} menuItems={[{ id: "template", label: "From template", icon: <Icon name="palette" />, trailingText: "T" }, { id: "duplicate", label: "Duplicate current", icon: <Icon name="image" />, trailingText: "D" }, { id: "import", label: "Import file", icon: <Icon name="plus" />, onSelect: () => setSnackbar(true) }]} /><ToggleButton selected={favorite} onChange={setFavorite}>Favorite</ToggleButton><ToggleButton selected={!favorite} onChange={() => setFavorite(!favorite)} variant="outlined" icon="image">Preview</ToggleButton></div></div><div><h3>Icon buttons</h3><div className={styles.row}><Tooltip content="Edit component"><IconButton icon="edit" label="Edit component" /></Tooltip><IconButton icon="favorite" label="Favorite" variant="tonal" selected={favorite} onClick={() => setFavorite(!favorite)} /><IconButton icon="share" label="Share" variant="outlined" /><IconButton icon="more" label="More options" variant="filled" /></div></div><div><h3>FAB menu</h3><FabMenu /></div></div>
      </DemoBlock>

      <DemoBlock id="selection" index="02" eyebrow="Selection" title="Choose with confidence" description="Chips and controls communicate state with shape, color and motion instead of relying on labels alone.">
        <div className={styles.demoGroup}><h3>Filter chips</h3><div className={styles.row}>{["Design", "Motion", "Accessibility", "Tokens"].map((chip) => <Chip key={chip} selected={selectedChips.includes(chip)} onClick={() => toggleChip(chip)}>{chip}</Chip>)}</div></div>
        <div className={styles.demoGroup}><h3>Assistive, suggestion & input chips</h3><div className={styles.row}><AdvancedChip chipType="assistive" icon="calendar">Add to calendar</AdvancedChip><AdvancedChip chipType="suggestion" icon="sparkle">Generate palette</AdvancedChip>{inputChips.map((chip) => <AdvancedChip key={chip} chipType="input" onRemove={() => setInputChips((items) => items.filter((item) => item !== chip))}>{chip}</AdvancedChip>)}</div></div>
        <div className={styles.controlsGrid}><div><h3>Switch</h3><Switch checked={switchOn} onChange={(event) => setSwitchOn(event.target.checked)} /><p>{switchOn ? "Notifications on" : "Notifications off"}</p></div><div><h3>Checkbox</h3><Checkbox label="Remember choice" checked={checked} onChange={(event) => setChecked(event.target.checked)} /></div><div><h3>Radio</h3>{["Compact", "Comfortable"].map((item) => <Radio key={item} name="density" label={item} checked={radio === item} onChange={() => setRadio(item)} />)}</div></div>
        <div className={styles.demoGroup}><h3>Segmented button</h3><div className={styles.segment}>{["Day", "Week", "Month"].map((item) => <button key={item} className={segment === item ? styles.segmentActive : ""} onClick={() => setSegment(item)}>{segment === item && <Icon name="check" width={16} />}{item}</button>)}</div></div>
      </DemoBlock>

      <DemoBlock id="inputs" index="03" eyebrow="Inputs" title="Fields with focus" description="Labels glide into place while focus states remain bold, legible and unmistakably Material.">
        <div className={styles.inputGrid}><TextField label="Project name" defaultValue="Material Playground" supporting="Use a memorable, descriptive name" /><TextField label="Email address" type="email" supporting="We will never share your email" /><MaterialSlider label="Component scale" initialValue={72} /></div>
        <div className={styles.demoGroup}><h3>Range slider</h3><RangeSlider /></div>
      </DemoBlock>

      <DemoBlock id="content" index="04" eyebrow="Content" title="Surfaces with depth" description="Cards organize related content and reveal elevation only when the interaction calls for it.">
        <div className={styles.cards}><Card eyebrow="Design systems" title="Shape creates character" actions={<><Button variant="text">Skip</Button><Button variant="tonal">Read more</Button></>}>Combine expressive corners and color to give familiar components a distinct voice.</Card><Card eyebrow="Motion" title="Movement with meaning" actions={<Button variant="text" icon="arrow">Explore</Button>}>Transitions connect cause and effect, helping users understand what changed and why.</Card></div>
        <div className={styles.contentGrid}><div><h3>Expressive carousel</h3><Carousel /></div><div><h3>Baseline list</h3><MaterialList /></div></div>
      </DemoBlock>

      <DemoBlock id="navigation" index="05" eyebrow="Navigation" title="Always know the way" description="Navigation adapts to the available space while preserving a consistent active indicator.">
        <NavigationBar active={nav} onChange={setNav} />
        <div className={styles.tabs}>{["Overview", "Specs", "Usage"].map((tab, index) => <button key={tab} className={nav % 3 === index ? styles.tabActive : ""} onClick={() => setNav(index)}>{tab}</button>)}</div>
        <div className={styles.demoGroup}><h3>Floating toolbar</h3><Toolbar /></div>
      </DemoBlock>

      <DemoBlock id="feedback" index="06" eyebrow="Feedback" title="Keep people informed" description="Progress and overlays appear at the right moment, explain system status, then get out of the way.">
        <div className={styles.feedbackGrid}>
          <div>
            <h3>Progress & loading indicators</h3>
            <div className={styles.progressShowcase}>
              <section className={styles.progressSection}>
                <h4>Standard</h4>
                <div className={styles.progressRow}>
                  <div className={styles.progressCard}>
                    <small>Circular determinate</small>
                    <CircularProgress variant="standard" state="determinate" value={0.72} />
                  </div>
                  <div className={styles.progressCard}>
                    <small>Circular indeterminate</small>
                    <CircularProgress variant="standard" state="indeterminate" />
                  </div>
                </div>
              </section>
              <section className={styles.progressSection}>
                <h4>Wavy</h4>
                <div className={styles.progressRow}>
                  <div className={styles.progressCard}>
                    <small>Circular determinate</small>
                    <CircularProgress variant="wavy" state="determinate" value={0.72} />
                  </div>
                  <div className={styles.progressCard}>
                    <small>Circular indeterminate</small>
                    <CircularProgress variant="wavy" state="indeterminate" />
                  </div>
                </div>
              </section>
              <section className={styles.progressSection}>
                <h4>Other indicators</h4>
                <div className={styles.progressSupport}>
                  <div className={styles.progressCard}>
                    <small>Loading indicator</small>
                    <LoadingIndicator />
                  </div>
                  <div className={styles.progressCard}>
                    <small>Linear standard</small>
                    <LinearProgress state="indeterminate" appearance="standard" />
                  </div>
                  <div className={styles.progressCard}>
                    <small>Linear wave</small>
                    <LinearProgress state="indeterminate" appearance="wave" />
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div><h3>Overlays</h3><div className={styles.row}><Button variant="tonal" onClick={() => setDialog(true)}>Open dialog</Button><Button variant="outlined" onClick={() => { setSnackbar(true); window.setTimeout(() => setSnackbar(false), 3500); }}>Show snackbar</Button><Tooltip rich content="Rich tooltips can include longer supporting text and an optional action."><Button variant="text">Hover for tooltip</Button></Tooltip></div></div>
        </div>
      </DemoBlock>

      <DemoBlock id="pickers" index="07" eyebrow="Pickers" title="Pick a moment" description="Calendar surfaces keep date selection direct, readable and comfortable across pointer and touch input.">
        <div className={styles.pickerGrid}><DatePicker /><div className={styles.pickerNote}><Icon name="calendar" /><small>Modal date picker</small><h3>Calendar interaction included</h3><p>Select a date to update the header. The reusable component is ready for connection to form state or a date library.</p><Button variant="tonal" icon="arrow">View API</Button></div></div>
      </DemoBlock>

      <footer className={styles.footer}><Icon name="sparkle" /><h2>Build something<br />wonderful.</h2><p>Material 3 UI playground · Next.js + SCSS Modules</p></footer>
    </div>

    {dialog && <div className={styles.backdrop} onMouseDown={() => setDialog(false)}><div role="dialog" aria-modal="true" className={styles.dialog} onMouseDown={(event) => event.stopPropagation()}><div className={styles.dialogIcon}><Icon name="sparkle" /></div><h2>Keep exploring?</h2><p>This dialog uses an emphasized entrance and a focused action hierarchy.</p><div><Button variant="text" onClick={() => setDialog(false)}>Cancel</Button><Button onClick={() => setDialog(false)}>Continue</Button></div></div></div>}
    <div className={`${styles.snackbar} ${snackbar ? styles.snackbarVisible : ""}`}><Icon name="check" /><span>Component saved to your library.</span><button onClick={() => setSnackbar(false)}>Dismiss</button></div>
  </main>;
}
