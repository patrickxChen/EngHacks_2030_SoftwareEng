interface BuildingBadgeProps {
  buildingCode: string;
}

export function BuildingBadge({ buildingCode }: BuildingBadgeProps): JSX.Element {
  return <span className={`building-badge building-${buildingCode.toLowerCase()}`}>{buildingCode}</span>;
}
