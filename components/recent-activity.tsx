import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, FlaskRoundIcon as Flask, Target, Zap } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "generation",
      description: "Generated 5 new molecules using MolBART",
      time: "10 minutes ago",
      icon: <Flask className="h-4 w-4" />,
      iconColor: "text-blue-500",
      user: { name: "Alex Kim", initials: "AK" },
    },
    {
      id: 2,
      type: "prediction",
      description: "Predicted binding affinity for EGFR target",
      time: "25 minutes ago",
      icon: <Target className="h-4 w-4" />,
      iconColor: "text-purple-500",
      user: { name: "Sarah Johnson", initials: "SJ" },
    },
    {
      id: 3,
      type: "data",
      description: "Updated ChEMBL and DrugBank data sources",
      time: "1 hour ago",
      icon: <Zap className="h-4 w-4" />,
      iconColor: "text-green-500",
      user: { name: "John Doe", initials: "JD" },
    },
    {
      id: 4,
      type: "generation",
      description: "Optimized molecule for better solubility",
      time: "2 hours ago",
      icon: <Flask className="h-4 w-4" />,
      iconColor: "text-blue-500",
      user: { name: "Alex Kim", initials: "AK" },
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <div className={`mt-1 rounded-full p-1 ${activity.iconColor} bg-muted`}>{activity.icon}</div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{activity.description}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>{activity.time}</span>
              <span className="mx-1">•</span>
              <Avatar className="h-4 w-4 mr-1">
                <AvatarFallback className="text-[8px]">{activity.user.initials}</AvatarFallback>
              </Avatar>
              <span>{activity.user.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

