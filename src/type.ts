export enum DetailsInfoEnum {
  PORSCHE = 'Porsche',
  POWER = 'Power',
  PERCISION = 'Percision',
  PASSIONS = 'Passions',
}

export interface AboutDataInterface {
  title: string
  description: string
  backgroundImage: string
  images: string[]
}

export enum SectionIdEnum {
  HERO = 'hero',
  ABOUT = 'about',
  MISSION = 'mission',
}
