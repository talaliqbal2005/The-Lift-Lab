import { useState } from 'react'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import EquipmentCard from '../components/EquipmentCard'
import PageIntro from '../components/PageIntro'
import { equipment, equipmentCategories } from '../data/equipment'
import { pageCopy } from '../data/site'

export default function Equipment() {
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? equipment : equipment.filter((item) => item.category === active)
  return <>
    <PageIntro {...pageCopy.equipment} />
    <section className="section section--top"><div className="container">
      <div className="filter-tabs" role="group" aria-label="Filter equipment by category">
        {equipmentCategories.map((category) => <button type="button" className={active === category ? 'filter-tab filter-tab--active' : 'filter-tab'} key={category} aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>)}
      </div>
      <LayoutGroup><div className="equipment-grid"><AnimatePresence mode="popLayout">{filtered.map((item, index) => <EquipmentCard item={item} index={index} key={item.name} />)}</AnimatePresence></div></LayoutGroup>
    </div></section>
  </>
}
