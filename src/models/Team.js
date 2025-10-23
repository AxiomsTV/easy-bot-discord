// Modelo de datos para Team

export class Team {
  constructor({
    name,
    tag = '',
    captain,
    members = [],
    tournamentId
  }) {
    this.id = Date.now();
    this.name = name;
    this.tag = tag;
    this.captain = {
      id: captain.id,
      username: captain.username,
      displayName: captain.displayName
    };
    this.members = members.map(member => ({
      id: member.id,
      username: member.username,
      displayName: member.displayName
    }));
    this.tournamentId = tournamentId;
    this.registeredAt = new Date();
    this.channelId = null;
    this.wins = 0;
    this.losses = 0;
    this.matches = [];
  }

  // Métodos para gestión de miembros
  addMember(member) {
    if (!this.hasMember(member.id)) {
      this.members.push({
        id: member.id,
        username: member.username,
        displayName: member.displayName
      });
    }
  }

  removeMember(memberId) {
    this.members = this.members.filter(member => member.id !== memberId);
  }

  hasMember(memberId) {
    return this.members.some(member => member.id === memberId) || 
           this.captain.id === memberId;
  }

  getMemberIds() {
    return [this.captain.id, ...this.members.map(m => m.id)];
  }

  // Métodos para estadísticas
  getTotalMatches() {
    return this.wins + this.losses;
  }

  getWinRate() {
    const total = this.getTotalMatches();
    return total > 0 ? (this.wins / total) * 100 : 0;
  }

  // Métodos para matches
  recordWin(matchId) {
    this.wins++;
    this.matches.push({ id: matchId, result: 'win', date: new Date() });
  }

  recordLoss(matchId) {
    this.losses++;
    this.matches.push({ id: matchId, result: 'loss', date: new Date() });
  }

  // Display helpers
  getDisplayName() {
    return this.tag ? `${this.name} [${this.tag}]` : this.name;
  }

  getMemberList() {
    const allMembers = [this.captain, ...this.members];
    return allMembers.map(member => member.displayName).join(', ');
  }

  // Validaciones
  isValid(requiredSize) {
    return this.members.length === requiredSize - 1; // -1 porque el capitán no está en members
  }

  // Métodos para export/import
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tag: this.tag,
      captain: this.captain,
      members: this.members,
      tournamentId: this.tournamentId,
      registeredAt: this.registeredAt.toISOString(),
      channelId: this.channelId,
      wins: this.wins,
      losses: this.losses,
      matches: this.matches
    };
  }

  static fromJSON(data) {
    const team = new Team({
      name: data.name,
      tag: data.tag,
      captain: data.captain,
      members: data.members,
      tournamentId: data.tournamentId
    });
    
    team.id = data.id;
    team.registeredAt = new Date(data.registeredAt);
    team.channelId = data.channelId;
    team.wins = data.wins;
    team.losses = data.losses;
    team.matches = data.matches;
    
    return team;
  }
}