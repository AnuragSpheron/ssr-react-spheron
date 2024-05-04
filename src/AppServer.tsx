import React from "react";
import {
  InstanceCard,
  InstanceCardType,
  InstanceCardState,
  InstanceCardScalingType,
  InstanceDeploymentType,
} from "@spheron/ui-library";

const AppServer = ({ instanceCard }: { instanceCard: any[] }) => {
  return (
    <p onClick={() => console.log("OK")} className="text-red-500 text-4xl">
      {instanceCard.map((card) => (
        <InstanceCard
          detailsPage={false}
          onClick={() => console.log("OKOK")}
          name={card.name || ""}
          updatedAt={"24 Aug"}
          domainName={card?.latestUrlPreview || "" || ""}
          region={card.region || ""}
          instanceCardType={InstanceCardType.DEFAULT || ""}
          id={card._id || ""}
          scalingType={InstanceCardScalingType.AUTO}
          instanceState={InstanceCardState.ACTIVE}
          instanceType={InstanceDeploymentType.ACCELERATE}
          totalPrice={
            card.state.toLowerCase() === "failed" ||
            card.state.toLowerCase() === "failed-start" ||
            card.state.toLowerCase() === "closed" ||
            card.state.toLowerCase() === "deprecated"
              ? undefined
              : card.defaultDailyTopup * 30
          }
          priceUnit="/mo"
          discountBadgeText={
            card?.discount ? `${card.discount.discountPercent}% OFF` : ""
          }
          isSelected={false}
          onCheckboxClick={(isSelected) => {}}
        />
      ))}
    </p>
  );
};

export default AppServer;
